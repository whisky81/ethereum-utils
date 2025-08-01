import './style.css';
type Field = { name: string; type: string };
type StructsMap = Record<string, Field[]>;
import TypedDataStructure from '../../utils/TypedDataStructure';

function StructFieldsRenderer({
  structFields,
  allStructs,
  message,
  setMessage,
  path
}: {
  structFields: Field[];
  allStructs: StructsMap;
  message: Record<string, any>;
  setMessage: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  path: Array<string>;
}) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedMessage = TypedDataStructure.updateStructureField(message, path, name, value);
    setMessage(updatedMessage);
  };

  return (
    <div className="struct-fields">
      {structFields.map(({ name, type }, index) => {
        if (type === "string" || type === "address" || type === "bytes") {
          return (
            <div key={index} className="data-input-field">
              <label>{name}</label>
              <input
                type="text"
                placeholder={`Enter ${name}`}
                value={TypedDataStructure.getStructureFieldValue(message, path, name) || ''}
                name={name}
                onChange={handleChange}
              />
            </div>
          );
        }

        if (type.startsWith("uint") || type.startsWith("int")) {
          return (
            <div key={index} className="data-input-field">
              <label>{name}</label>
              <input
                type="number"
                placeholder={`Enter ${name}`}
                value={TypedDataStructure.getStructureFieldValue(message, path, name) || ''}
                name={name}
                onChange={handleChange}
              />

            </div>
          );
        }

        if (type === "bool") {
          return (
            <div key={index} className="data-input-field">
              <label>{name}</label>
              <select required name={name} onChange={handleChange}>
                <option value="true">True</option>
                <option value="">False</option>
              </select>
            </div>
          );
        }

        // Custom struct type
        const nestedStruct = allStructs[type];
        if (nestedStruct) {
          return (
            <div key={index} className="nested-struct">
              <h5>{name} ({type})</h5>
              <StructFieldsRenderer
                structFields={nestedStruct}
                allStructs={allStructs}
                message={message}
                setMessage={setMessage}
                path={[...path, name]}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

function EIP712MessageData({
  typedDataStructures,
  primaryType,
  setPrimaryType,
  message,
  setMessage,
}: {
  typedDataStructures: StructsMap;
  primaryType: string;
  setPrimaryType: React.Dispatch<React.SetStateAction<string>>;
  message: Record<string, any>;
  setMessage: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) {

  const selectedStruct = typedDataStructures[primaryType];
  return (
    <div className="eip712-message-data">
      <h3>Message Data</h3>
      <p>Actual Data for the Message Struct (Typed Data Structure)</p>

      <h4>Select Primary Type</h4>
      <select
        name="message-data-type"
        value={primaryType}
        onChange={(e) => setPrimaryType(e.target.value)}
      >
        <option value="">Select Type</option>
        {Object.keys(typedDataStructures).map((name, i) => (
          <option key={i} value={name}>
            {name}
          </option>
        ))}
      </select>

      {selectedStruct && (
        <StructFieldsRenderer
          structFields={selectedStruct}
          allStructs={typedDataStructures}
          message={message}
          setMessage={setMessage}
          path={[]}
        />
      )}
    </div>
  );
}

export default EIP712MessageData;
