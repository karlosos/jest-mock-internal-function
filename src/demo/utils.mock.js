export const getDataSimple = async (name) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    return `Mocked ${name}!`;
}

export const getDataError = async (name) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    throw new Error('error in getData')
}