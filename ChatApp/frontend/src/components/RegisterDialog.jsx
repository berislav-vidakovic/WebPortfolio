import { useState } from "react";

function RegisterDialog({ onCancel, onConfirm }) {
  const [login, setLogin] = useState("");
  const [fullName, setFullName] = useState("");

  const handleConfirm = () => {
    if (!login.trim() || !fullName.trim()) return;
    onConfirm({ login: login.trim(), fullName: fullName.trim() });
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Register</h3>
        <div className="form-field">
          <label>Login:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Enter login"
          />
        </div>
        <div className="form-field">
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>
        <div className="dialog-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleConfirm} disabled={!login || !fullName}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterDialog;
