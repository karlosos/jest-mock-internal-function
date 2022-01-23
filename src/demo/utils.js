const getData = async (name) => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    return `Hello ${name}!`;
}

export { getData }