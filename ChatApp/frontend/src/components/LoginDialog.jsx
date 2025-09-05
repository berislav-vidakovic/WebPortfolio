import { useState } from "react";

function LoginDialog({ users, onCancel, onConfirm }) {
  const [selectedLogin, setSelectedLogin] = useState("");

  const selectedUser = users.find((u) => u.login === selectedLogin);

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Select User</h3>
        <select
          value={selectedLogin}
          onChange={(e) => setSelectedLogin(e.target.value)}
        >
          <option value="">-- Choose Login --</option>
          {users.map((u) => (
            <option key={u.userId} value={u.login}>
              {u.login}
            </option>
          ))}
        </select>
        {selectedUser && (
          <p className="full-name">Full Name: {selectedUser.fullName}</p>
        )}
        <div className="dialog-actions">
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={() => onConfirm(selectedUser)}
            disabled={!selectedUser}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginDialog;
