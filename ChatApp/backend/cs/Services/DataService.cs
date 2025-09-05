using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using cs.Models;
using Npgsql;

namespace cs.Services
{
  public class DataService
  {
    private readonly string _connectionString;

    public DataService(string connectionString)
    {
      _connectionString = connectionString;
    }

    public async Task<DataModel> LoadDataAsync()
    {
      var data = new DataModel
      {
        Users = new List<User>(),
        Chats = new List<Chat>(),
        Messages = new List<Message>()
      };

      await using var conn = new NpgsqlConnection(_connectionString);
      await conn.OpenAsync();

      // Load Users
      await using (var cmd = new NpgsqlCommand("SELECT user_id, login, full_name FROM users", conn))
      await using (var reader = await cmd.ExecuteReaderAsync())
      {
        while (await reader.ReadAsync())
        {
          data.Users.Add(new User
          {
            UserId = reader.GetInt32(0),
            Login = reader.GetString(1),
            FullName = reader.IsDBNull(2) ? null : reader.GetString(2)
          });
        }
      }

      // Load Chats
      await using (var cmd = new NpgsqlCommand("SELECT chat_id FROM chats", conn))
      await using (var reader = await cmd.ExecuteReaderAsync())
      {
        while (await reader.ReadAsync())
        {
          data.Chats.Add(new Chat
          {
            ChatId = reader.GetInt32(0),
            UserIds = new List<int>(),
            Messages = new List<Message>()
          });
        }
      }

      // Load Chat Users
      await using (var cmd = new NpgsqlCommand("SELECT chat_id, user_id FROM chat_users", conn))
      await using (var reader = await cmd.ExecuteReaderAsync())
      {
        while (await reader.ReadAsync())
        {
          var chat = data.Chats.Find(c => c.ChatId == reader.GetInt32(0));
          if (chat != null)
            chat.UserIds.Add(reader.GetInt32(1));
        }
      }

      // Load Messages
      await using (var cmd = new NpgsqlCommand("SELECT msg_id, chat_id, user_id, datetime, text FROM messages", conn))
      await using (var reader = await cmd.ExecuteReaderAsync())
      {
        while (await reader.ReadAsync())
        {
          var msg = new Message
          {
            MsgId = reader.GetInt32(0),
            ChatId = reader.GetInt32(1),
            UserId = reader.GetInt32(2),
            DateTime = reader.GetDateTime(3),
            Text = reader.IsDBNull(4) ? null : reader.GetString(4)
          };

          data.Messages.Add(msg);

          // Add message to corresponding chat
          var chat = data.Chats.Find(c => c.ChatId == msg.ChatId);
          chat?.Messages.Add(msg);
        }
      }

      return data;
    }

    public async Task<Message> AddMessageAsync(Message newMsg)
    {
      await using var conn = new NpgsqlConnection(_connectionString);
      await conn.OpenAsync();

      var cmdText = @"INSERT INTO messages (chat_id, user_id, datetime, text)
                            VALUES (@chat_id, @user_id, @datetime, @text)
                            RETURNING msg_id;";

      await using var cmd = new NpgsqlCommand(cmdText, conn);
      cmd.Parameters.AddWithValue("chat_id", newMsg.ChatId);
      cmd.Parameters.AddWithValue("user_id", newMsg.UserId);
      cmd.Parameters.AddWithValue("datetime", newMsg.DateTime);
      cmd.Parameters.AddWithValue("text", newMsg.Text ?? (object)DBNull.Value);

      // Execute and get generated msg_id
      var msgId = (int)await cmd.ExecuteScalarAsync();
      newMsg.MsgId = msgId;

      return newMsg;
    }

    public async Task<User?> GetUserByLoginAsync(string login)
        {
            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            const string sql = @"
                SELECT user_id, login, full_name
                FROM users
                WHERE lower(login) = lower(@login)
                LIMIT 1;
            ";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("login", login);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new User
                {
                    UserId  = reader.GetInt32(0),
                    Login   = reader.GetString(1),
                    FullName = reader.IsDBNull(2) ? null : reader.GetString(2)
                };
            }
            return null;
        }

        public async Task<User> AddUserAsync(User newUser)
        {
            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            const string sql = @"
                INSERT INTO users (login, full_name)
                VALUES (@login, @full_name)
                RETURNING user_id;
            ";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("login", newUser.Login);
            cmd.Parameters.AddWithValue("full_name", (object?)newUser.FullName ?? DBNull.Value);

            var newIdObj = await cmd.ExecuteScalarAsync();
            var newId = Convert.ToInt32(newIdObj);

            return new User
            {
                UserId = newId,
                Login = newUser.Login,
                FullName = newUser.FullName
            };
        }
  }
}
