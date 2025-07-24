import { useState } from 'react';
import './style.css';
import Account from '../../utils/Account';

function EIP712MessageStruct({
  typedDataStructures,
  setTypedDataStructures
}: {
  typedDataStructures: Record<string, Array<{ name: string; type: string }>>;
  setTypedDataStructures: React.Dispatch<
    React.SetStateAction<Record<string, Array<{ name: string; type: string }>>>
  >;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  const handleAddStruct = () => {
    const formattedName = Account.styleTypedDataStructureName(newTypeName);
    if (!formattedName) return;
    if (!typedDataStructures[formattedName]) {
      setTypedDataStructures(prev => ({
        ...prev,
        [formattedName]: []
      }));
    }
    setNewTypeName('');
    setShowPopup(false);
  };

  const handleDeleteStruct = (structName: string) => {
    const updated = { ...typedDataStructures };
    delete updated[structName];
    setTypedDataStructures(updated);
  };

  return (
    <div className="eip712-message">
      <h3>EIP712 Message Struct (Typed Data Structure)</h3>
      <p>This component is used to define the structure of EIP712 messages.</p>

      <button className="add-btn" onClick={() => setShowPopup(true)}>＋</button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <label>
              Type name:
              <input
                type="text"
                value={newTypeName}
                onChange={e => setNewTypeName(e.target.value)}
              />
            </label>
            <div className="popup-buttons">
              <button onClick={handleAddStruct}>OK</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="typed-list">
        {Object.entries(typedDataStructures).map(([structName, fields], i) => (
          <div key={i} className="typed-item">
            <div className="typed-header">
              <h4>{structName}</h4>
              <button className="remove-type-btn" onClick={() => handleDeleteStruct(structName)}>
                ✕
              </button>
            </div>
            {fields.map((field, j) => (
              <div key={j} className="typed-field">
                <input
                  type="text"
                  placeholder="Name"
                  value={field.name}
                  required
                  onChange={e => {
                    const updated = [...fields];
                    updated[j].name = e.target.value;
                    setTypedDataStructures(prev => ({
                      ...prev,
                      [structName]: updated
                    }));
                  }}
                />
                <select
                  name="type"
                  value={field.type}
                  onChange={(e) => {
                    const updated = [...fields];
                    updated[j].type = e.target.value;
                    setTypedDataStructures(prev => ({
                      ...prev,
                      [structName]: updated
                    }));
                  }}
                >
                  <option value="string">string</option>
                  <option value="address">address</option>
                  <option value="bytes">bytes</option>
                  <option value="uint">uint[1-256]</option>
                  <option value="int">int[1-256]</option>
                  <option value="bool">bool</option>
                  {Object.keys(typedDataStructures).map(type => {
                    if (type !== structName) {
                      return <option key={type} value={type}>{type}</option>;
                    } else {
                      return null;
                    }
                  })}
                </select>

              </div>
            ))}
            <button
              className="sub-add-btn"
              onClick={() => {
                const updated = [...fields, { name: '', type: 'string' }];
                setTypedDataStructures(prev => ({
                  ...prev,
                  [structName]: updated
                }));
              }}
            >＋</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EIP712MessageStruct;
