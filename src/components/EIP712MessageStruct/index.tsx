import { useState } from 'react';
import './style.css';
import Account from '../../utils/Account';

function IntegerRange({ type }: { type: string }) {
  return (
    <>
      {Array.from({ length: 256 }, (_, i) => i + 1).map((i) => (
        <option key={i} value={`${type}${i}`}>{`${type}${i}`}</option>
      ))}
    </>
  );
}

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

  const updateStructType = (structName: string, fields: Array<{ name: string, type: string }>, index: number, key: string, value: string) => {
    const updated = [...fields];
    if (key === 'name') {
      updated[index].name = value;
    } else {
      updated[index].type = value;
    }
    setTypedDataStructures(prev => ({
      ...prev,
      [structName]: updated
    }));

  }

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
                    updateStructType(structName, fields, j, 'name', e.target.value);
                  }}
                />
                <select
                  name="type"
                  value={field.type}
                  onChange={(e) => {
                    updateStructType(structName, fields, j, 'type', e.target.value);
                  }}
                >
                  <option value="string">string</option>
                  <option value="address">address</option>
                  <option value="bytes">bytes</option>
                  <IntegerRange type="uint" />
                  <IntegerRange type="int" />
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
