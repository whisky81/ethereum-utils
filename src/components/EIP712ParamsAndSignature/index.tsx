

function EIP712ParamsAndSignature({
    params,
    signature,
    setStep,
    setParamsAndSignature
}: {
    params: string;
    signature: string;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setParamsAndSignature: React.Dispatch<React.SetStateAction<{ params: string, signature: string }>>;
}) {
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (e) {
        }
    };

    return (
        <div className="result-section">
            <h3>Signature Result</h3>

            <p><strong>Params:</strong></p>
            <pre className="params-box">
                {(() => {
                    try {
                        const parsed = JSON.parse(params);
                        return <code>{JSON.stringify(parsed, null, 2)}</code>;
                    } catch {
                        return <code>{params}</code>;
                    }
                })()}
            </pre>

            <p><strong>Signature:</strong></p>
            <div className="signature-box">
                <code>{signature}</code>
                <button onClick={() => copyToClipboard(signature)} className="copy-button">
                    Copy
                </button>
            </div>

            <button onClick={() => {
                setStep(1);
                setParamsAndSignature({ params: '', signature: '' });
            }} className="nav-button nav-button-next">
                OK
            </button>
        </div>
    );
}

export default EIP712ParamsAndSignature;