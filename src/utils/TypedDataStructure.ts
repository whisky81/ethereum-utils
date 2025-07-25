class TypedDataStructure {
    public static updateStructureField(
        message: Record<string, any>,
        path: string[],
        name: string,
        value: any
    ): Record<string, any> {
        const updatedMessage = structuredClone(message);
        let current = updatedMessage;

        for (const key of path) {
            if (!current[key]) current[key] = {};
            current = current[key];
        }

        current[name] = value;
        return updatedMessage;
    }

    public static getStructureFieldValue(
        message: Record<string, any>,
        path: string[],
        name: string 
    ): any {
        let current = message;
        for (const key of path) {
            if (!current[key]) return undefined;
            current = current[key];
        }
        return current[name];
    }
}

export default TypedDataStructure;