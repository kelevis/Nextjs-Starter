const fs = require("fs").promises;
const solc = require("solc");

async function main() {
    // 读取合约源码
    const sourceCode = await fs.readFile("SimpleStorage.sol", "utf8");

    // console.log("sourceCode:",sourceCode)

    // 编译源码并获取 ABI 和字节码
    const { abi, bytecode } = compile(sourceCode, "SimpleStorage");

    console.log("abi:",abi)
    console.log("bytecode:",bytecode)

    // 将 ABI 和字节码存储到 JSON 文件中
    const artifact = JSON.stringify({ abi, bytecode }, null, 2);
    await fs.writeFile("SimpleStorage.json", artifact);
}

function compile(sourceCode, contractName) {
    // 创建 Solidity 编译器的标准输入和输出 JSON
    const input = {
        language: "Solidity",
        sources: { [contractName]: { content: sourceCode } }, // 使用 contractName 作为 key
        settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
    };
    // 编译并解析输出
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const artifact = output.contracts[contractName][contractName];
    return {
        abi: artifact.abi,
        bytecode: artifact.evm.bytecode.object,
    };
}

main().then(() => process.exit(0)).catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
