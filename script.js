
import { ethers } from './node_modules/ethers/dist/ethers.min.js'
import wcPkg from "https://esm.run/@walletconnect/ethereum-provider/dist/index.umd.js"
const EthereumProvider = wcPkg.EthereumProvider

const walletConnectProjectId = 'b0865b6ca065423e47b7d6dffa2f5e18'

const rETHcontract = '0xae78736Cd615f374D3085123A210448E74Fc6393';

const title = document.createElement('h1')
const accountLabel = document.createElement('label')
accountLabel.style.visibility = "hidden";
const rETHBalanceDiv = document.createElement('div')
const ETHBalanceDiv = document.createElement('div')
const rETHHistoryDiv = document.createElement('div')
const rETHPricesDiv = document.createElement('div')
const rETHApprovalsDiv = document.createElement('div')
const walletSelectDiv = document.createElement('div')
const statusDiv = document.createElement('div')
const loading = document.createElement("p");
const mintCheckbox = document.querySelector("#mint");
const burnCheckbox = document.querySelector("#burn");
const mintBtn = document.querySelector("#mintBtn");
const mintInput = document.getElementById("mintInput");
const burnBtn = document.querySelector("#burnBtn");
const burnInput = document.getElementById("burnInput");
const errorMessageEl = document.getElementById('errorMsg');
const successMessageEl = document.getElementById('successMsg')


const ERC20_ABI = [
    {
        "inputs": [
            {
                "internalType": "contract RocketStorageInterface",
                "name": "_rocketStorageAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
            }
        ],
        "name": "EtherDeposited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ethAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
            }
        ],
        "name": "TokensBurned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ethAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
            }
        ],
        "name": "TokensMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rethAmount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "depositExcess",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "depositExcessCollateral",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCollateralRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rethAmount",
                "type": "uint256"
            }
        ],
        "name": "getEthValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getExchangeRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_ethAmount",
                "type": "uint256"
            }
        ],
        "name": "getRethValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalCollateral",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_ethAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "version",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]


console.log("problem ok")




const navContainer = document.querySelector("#balance")

title.innerText = 'Unofficial Rocket Pool Liquid Staking Interface'
statusDiv.innerText = 'loading...'

console.log("Spot 1");

/*document.querySelector('body').append(
  title,
  walletSelectDiv,
  accountLabel,
  rETHBalanceDiv,
  ETHBalanceDiv,
  rETHPricesDiv,
  rETHHistoryDiv,
  rETHApprovalsDiv,
  statusDiv
)*/

navContainer.append(
    accountLabel,
    rETHBalanceDiv,
    ETHBalanceDiv,
    walletSelectDiv
)


document.querySelector(".row").append(
    statusDiv



)



document.querySelector(".firstRight").append(

    rETHPricesDiv,
    rETHHistoryDiv

)



let browserProvider = new ethers.BrowserProvider(window.ethereum)
let signer
let network = { name: 'mainnet', chainId: '0x1' }


console.log("Spot 2");


const etherscanLinkEL = document.getElementById('etherscan-link');
const openseaLinkEL = document.getElementById('opensea-link');





if ('request' in browserProvider) {
    await browserProvider
        .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: network.chainId }] })
        .catch(err => {
            console.error(`Could not switch browserProvider chain ${err}`)
            browserProvider = null
        })
}

const providers = browserProvider ? [browserProvider] : []
providers.push(ethers.getDefaultProvider(network.name))
let provider = new ethers.FallbackProvider(providers)
// TODO: make network configurable
// TODO: allow custom RPC?





const rocketStorageAddress = '0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46'



const rocketStorage = new ethers.Contract(rocketStorageAddress,
    ['function getAddress(bytes32) view returns (address)'],
    provider)



const getRocketAddress = name => rocketStorage['getAddress(bytes32)'](ethers.id(`contract.address${name}`))

console.log(getRocketAddress("rocketTokenRETH"));




const rocketToken = new ethers.Contract("0xae78736Cd615f374D3085123A210448E74Fc6393",
    ['function balanceOf(address) view returns (uint256)',
        'function allowance(address _owner, address _spender) view returns (uint256)',
        'function getExchangeRate() view returns (uint256)',
        'event Transfer(address indexed _from, address indexed _to, uint256)'
    ],
    provider)


console.log("Spot 3");






function createAddressInput() {

    console.log("Spot Create Address fine");
    const div = document.createElement('div')
    const input = document.createElement('input')
    const span = document.createElement('span')
    div.classList.add('address')
    div.appendChild(input)
    div.appendChild(span)
    input.addEventListener('change', async () => {
        let resolve
        input.theAddress = new Promise(x => resolve = x)
        span.innerText = 'loading...'
        input.value = input.value.trim()
        const { address, ensName } = ethers.isAddress(input.value) ?
            {
                address: input.value,
                ensName: await provider.lookupAddress(input.value).catch(e => e)
            } :
            {
                address: await provider.resolveName(input.value).catch(e => e),
                ensName: input.value
            }
        input.setCustomValidity('')
        if (ethers.isAddress(address)) {
            const checksummedAddress = ethers.getAddress(address)
            resolve(checksummedAddress)
            if (typeof ensName == 'string') {
                input.value = ensName
                input.classList.remove('address')
                span.innerText = checksummedAddress
                span.appendChild(document.createTextNode(' '))
            }
            else {
                input.value = checksummedAddress
                input.classList.add('address')
                span.innerText = ''
            }
            const a = span.appendChild(document.createElement('a'))
            a.innerText = '📋'
            a.addEventListener('click', () => {
                navigator.clipboard.writeText(checksummedAddress)
                a.innerText = 'copied!'
                setTimeout(() => a.innerText = '📋', 696)
            }, { passive: true })
        }
        else {
            if (typeof ensName == 'string' && ensName.endsWith('.eth'))
                span.innerText = `No address found for ${ensName}`
            else if (input.value != '')
                span.innerText = 'Checksummed address (0x69Fe...) or ENS name (amy.eth)'
            else
                span.innerText = ''
            input.classList.remove('address')
            input.setCustomValidity('Need Ethereum address or ENS name')
            resolve()
        }
    }, { passive: true })
    return { div, input }
}

accountLabel.innerText = 'Account: '

const accountInput = createAddressInput()
accountInput.input.style.width = '0px'


accountLabel.appendChild(accountInput.div)

accountLabel.style.visibility = "visible";


function createBalanceDiv(div, token) {
    const label = div.appendChild(document.createElement('label'))
    label.innerText = `${token} balance: `
    const input = div.appendChild(document.createElement('input'))
    const span = div.appendChild(document.createElement('span'))
    input.type = 'text'
    input.setAttribute('readonly', '')
    div.classList.add('balance')
    return { input, span }
}

const { input: rETHBalanceInput, span: rETHBalanceSpan } = createBalanceDiv(rETHBalanceDiv, 'rETH')
const { input: ETHBalanceInput, span: ETHBalanceSpan } = createBalanceDiv(ETHBalanceDiv, 'ETH')

rETHBalanceInput.style.width = '0px'
ETHBalanceInput.style.width = '0px'

async function updateBalances() {

    rETHBalanceInput.style.width = '0px'
    ETHBalanceInput.style.width = '0px'


    rETHBalanceSpan.innerText = 'loading...'
    ETHBalanceSpan.innerText = 'loading...'
    const address = await accountInput.input.theAddress
    if (address) {
        const rETHBalance = await rocketToken.balanceOf(address)
        const ETHBalance = await provider.getBalance(address)
        rETHBalanceInput.value = ethers.formatEther(rETHBalance)
        ETHBalanceInput.value = ethers.formatEther(ETHBalance)
        rETHBalanceInput.style.width = 'auto'
        ETHBalanceInput.style.width = 'auto'
    }
    else {
        rETHBalanceInput.value = ''
        ETHBalanceInput.value = ''
        rETHBalanceInput.style.visibility = 'visible'
        ETHBalanceInput.style.visibility = 'visible'
    }
    rETHBalanceSpan.innerText = ''
    ETHBalanceSpan.innerText = ''
}

const DBPromise = new Promise(resolve => {
    const openRequest = window.indexedDB.open('RocketFront', 1)
    openRequest.addEventListener('error',
        () => {
            resolve(null)
            console.error(`error opening db: ${openRequest.error}`)
        },
        { passive: true, once: true }
    )
    openRequest.addEventListener('upgradeneeded',
        () => {
            const db = openRequest.result
            const priceStore = db.createObjectStore('rETH-prices', { keyPath: 'blockNumber' })
            const transferStore = db.createObjectStore(
                'rETH-transfers',
                { keyPath: ['from', 'to', 'transactionHash', 'transactionIndex'] })
            const transferQueryStore = db.createObjectStore('rETH-transfer-queries', { keyPath: 'account' })
            const priceIndex = priceStore.createIndex('', 'blockNumber', { unique: true })
            const transferFromIndex = transferStore.createIndex('from', ['from', 'blockNumber'])
            const transferToIndex = transferStore.createIndex('to', ['to', 'blockNumber'])
        },
        { passive: true, once: true })
    openRequest.addEventListener('success',
        () => resolve(openRequest.result),
        { passive: true, once: true }
    )
})

function requestToPromise(req) {
    return new Promise((resolve, reject) => {
        req.addEventListener('success', () => resolve(req.result), { once: true, passive: true })
        req.addEventListener('error', () => reject(req.error), { once: true, passive: true })
        if (req.readyState === 'done')
            req.dispatchEvent(new Event(req.error === null ? 'error' : 'success'))
    })
}

// TODO: make configurable by user?
const MAX_QUERY_LENGTH = 1000

async function ensureTransfers(account, minBlock, maxBlock) {
    const db = await DBPromise
    const transaction = db.transaction(['rETH-transfers', 'rETH-transfer-queries'], 'readwrite')
    const transferQueryStore = transaction.objectStore('rETH-transfer-queries')
    const transferStore = transaction.objectStore('rETH-transfers')
    const testEntry = await transferQueryStore.get(account)
    const entry = testEntry || {}
    if (typeof entry.account === 'undefined') entry.account = account
    if (typeof entry.to === 'undefined') entry.to = { min: Infinity, max: -Infinity }
    if (typeof entry.from === 'undefined') entry.from = { min: Infinity, max: -Infinity }
    if (typeof testEntry === 'undefined') await transferQueryStore.add(entry, account)
    if (!'from' in entry) {
        console.error(`idk ${Object.keys(entry)}`)
        return
    }
    if (typeof entry.from !== 'object') {
        console.error(`idkw ${typeof entry.from}`)
        return
    }
    const makeLowerRange = (x, filter) => ({ min: minBlock, max: Math.min(maxBlock, x.min), filter, record: x })
    const makeUpperRange = (x, filter) => ({ min: Math.max(x.max, minBlock), max: maxBlock, filter, record: x })
    const TransferFilter = rocketToken.filters['Transfer']
    const TransferFromFilter = TransferFilter(account, null, null)
    const TransferToFilter = TransferFilter(null, account, null)
    const ranges = [
        makeLowerRange(entry.from, TransferFromFilter),
        makeUpperRange(entry.from, TransferFromFilter),
        makeLowerRange(entry.to, TransferToFilter),
        makeUpperRange(entry.to, TransferToFilter)
    ]
    for (const { min, max, filter, record } of ranges) {
        let currentMin = min
        const calculateMax = () => Math.min(max, currentMin + MAX_QUERY_LENGTH)
        let currentMax = calculateMax()
        while (currentMin < max) {
            const logs = await rocketToken.queryFilter(filter, currentMin, currentMax)
            for (const log of logs) {
                const from = log.args[0]
                const to = log.args[1]
                const amount = log.args[2]
                const transactionHash = log.transactionHash
                const transactionIndex = log.transactionIndex
                const blockNumber = log.blockNumber
                const key = [from, to, log.transactionHash, log.transactionIndex]
                const checkKey = await requestToPromise(transferStore.getKey(key))
                if (typeof checkKey === 'undefined')
                    await requestToPromise(
                        transferStore.add(
                            { from, to, amount, transactionHash, transactionIndex, blockNumber })
                    )
            }
            currentMin = currentMax
            currentMax = calculateMax()
        }
        if (min < record.min) record.min = min
        if (max > record.max) record.max = max
    }
    await transferQueryStore.put(entry, account)
}

async function updateHistory() {
    const address = await accountInput.input.theAddress
    if (!address) return // TODO: clear history as necessary
    const blockNumber = parseInt(blockNumberNode.textContent)
    await ensureTransfers(address, 0, blockNumber)
    // TODO: ensure we have rETH-prices for all the transfers above
    /*
    const range = IDBKeyRange.bound(
      [account, minBlock, 0],
      [account, maxBlock + 1, 0], false, true)
    const fromIndex = transferStore.index('from')
    const fromKeys = await requestToPromise(fromIndex.getAllKeys(range))
    const toIndex = transferStore.index('to')
    const toKeys = await requestToPromise(toIndex.getAllKeys(range))
    */
    // TODO: collect all transfers to/from the current account, and their NAV price
    // TODO: display rETH transfer history and profits
}

async function changeAccount() {
    await updateBlockNumber()
    await updateBalances()
    await updateHistory()
}

accountInput.input.addEventListener('change', changeAccount, { passive: true })

walletSelectDiv.classList.add('wallet')
const browserWalletLabel = walletSelectDiv.appendChild(document.createElement('label'))
const browserWalletRadio = document.createElement('input')
const walletConnectLabel = walletSelectDiv.appendChild(document.createElement('label'))
const walletConnectRadio = document.createElement('input')
walletConnectLabel.innerText = 'WalletConnect'
browserWalletLabel.innerText = 'Browser'
walletConnectLabel.appendChild(walletConnectRadio)
browserWalletLabel.appendChild(browserWalletRadio)
walletConnectRadio.type = 'radio'
browserWalletRadio.type = 'radio'
walletConnectRadio.name = 'wallet'
browserWalletRadio.name = 'wallet'
browserWalletRadio.checked = true
// TODO: also disable switching radio when connected

window.ethereum.on('accountsChanged', connectBrowserAccount)
















// TODO: make accountInput a state machine

async function connectBrowserAccount(accounts) {
    accounts = await accounts
    if (!accounts.length) {
        connectButton.disabled = false
        accountInput.input.value = ''
        accountInput.input.dispatchEvent(new Event('change'))
        accountInput.input.removeAttribute('readonly')
    }
    else if (accounts[0] !== accountInput.input.value) {
        connectButton.disabled = true
        signer = await browserProvider.getSigner()
        accountInput.input.value = await signer.getAddress()
        accountInput.input.style.width = 'auto'
        accountInput.input.dispatchEvent(new Event('change'))
        accountInput.input.setAttribute('readonly', '')


    }
    else {
        // TODO: any checks required if account has not changed?
    }
}


const mint = async () => {


    //depositPoolContract deposit function instead of MINT
    //


    console.log("Mint started...");




    mintBtn.innerHTML = "Minting...";
    mintBtn.disabled = true;


    let provider = new ethers.BrowserProvider(window.ethereum)

 
    let signer = await browserProvider.getSigner()


    //change ABI & address:  https://etherscan.io/address/0xdd3f50f8a6cafbe9b31a427582963f465e745af8#writeContract


    const rocketPoolDepositContract = new ethers.Contract("0xDD3f50F8A6CafbE9b31a427582963f465E745AF8",
        [
            'function deposit() payable external',

        ])


        



    

    try {





        let amount = mintInput.value;

        let formatted = ethers.parseEther(amount)

        console.log(formatted);
        console.log(Object.values(rocketPoolDepositContract))


        //const tx = await signer.sendTransaction(rocketPoolDepositContract.deposit({ value: formatted }))

        //change function call too
        const tx = await  rocketPoolDepositContract.connect(signer).deposit({ value: formatted });

   
        console.log(`Transaction hash: ${tx.hash}`);
        const tx_hash = await tx.wait();
        console.log("tx_hash:" + tx_hash);
        //const send = await signer.sendTransaction({tx})
        successMessageEl.innerHTML = "Successfully Minted";
        mintBtn.innerHTML = "Mint";
        mintBtn.disabled = false;

        console.log(`Transaction confirmed in block ${tx.bloc}`);
        console.log(`Gas used: ${tx_hash.gasUsed.toString()}`);



    } catch (e) {
        errorMessageEl.innerHTML = `${e.message}`;
        console.log(e.message)
        mintBtn.innerHTML = "Mint";
        mintBtn.disabled = false;
    }
}


const burn = async () => {


    //depositPoolContract deposit function instead of MINT
    //


    console.log("Burn started...");

 



    burnBtn.innerHTML = "Burning...";
    burnBtn.disabled = true;


    let provider = new ethers.BrowserProvider(window.ethereum)

 
    let signer = await browserProvider.getSigner()


    //change ABI & address:  https://etherscan.io/address/0xdd3f50f8a6cafbe9b31a427582963f465e745af8#writeContract

    const _contract = new ethers.Contract(rETHcontract, ERC20_ABI, signer);
   


        



    

    try {





        let amount = burnInput.value;

        let formatted = ethers.parseEther(amount)

        console.log(formatted);
        console.log(Object.values(_contract))


        //const tx = await signer.sendTransaction(rocketPoolDepositContract.deposit({ value: formatted }))

        //change function call too
        const tx = await  _contract.connect(signer).burn(formatted);

   
        console.log(`Transaction hash: ${tx.hash}`);
        const tx_hash = await tx.wait();
        console.log("tx_hash:" + tx_hash);
        //const send = await signer.sendTransaction({tx})
        successMessageEl.innerHTML = "Successfully burnt!";
        burnBtn.innerHTML = "Burn";
        burnBtn.disabled = false;

        console.log(`Transaction confirmed in block ${tx.bloc}`);
        console.log(`Gas used: ${tx_hash.gasUsed.toString()}`);



    } catch (e) {
        errorMessageEl.innerHTML = `${e.message}`;
        console.log(e.message)
        burnBtn.innerHTML = "Burn";
        burnBtn.disabled = false;
    }
}



function initializeApp() {
    console.log("Going at least");



    mintCheckbox.addEventListener("change", function () {
        console.log("Running Mint Select");
        if (mintCheckbox.checked) {
            burnCheckbox.checked = false;
            mintBtn.classList.remove("hidden2");
            mintInput.classList.remove("hidden2")
            burnBtn.classList.add("hidden2");
            burnInput.classList.add("hidden2")
        } else {
            mintBtn.classList.add("hidden2");
        }
    });

    burnCheckbox.addEventListener("change", function () {
        console.log("Running Burn Select");
        if (burnCheckbox.checked) {
            mintCheckbox.checked = false;
            burnBtn.classList.remove("hidden2");
            mintBtn.classList.add("hidden2");
            mintInput.classList.add("hidden2")
            burnInput.classList.remove("hidden2")
        } else {
            burnBtn.classList.add("hidden2");
        }
    });






    mintBtn.addEventListener("click", mint);
    burnBtn.addEventListener("click", burn);
}


document.addEventListener("DOMContentLoaded", initializeApp);


const wcEthereum = await EthereumProvider.init({
    projectId: walletConnectProjectId,
    chains: [1], // TODO: add other chains as needed
    showQrModal: false,
    methods: ["eth_sendTransaction", "personal_sign"],
    events: ["chainChanged", "accountsChanged"],
})

const connectButton = walletSelectDiv.appendChild(document.createElement('input'))
connectButton.type = 'button'
connectButton.value = 'Connect'
connectButton.addEventListener('click', () => {
    if (browserWalletRadio.checked)
        connectBrowserAccount(
            window.ethereum.request({ method: 'eth_requestAccounts', params: [] })
        )
    else {
        console.assert(walletConnectRadio.checked, `No walletSelect radio checked`)
        wcEthereum.request({ method: 'eth_requestAccounts' }) // TODO: handle result
    }
}, { passive: true })

statusDiv.classList.add('status')

// TODO: make statusConnected a network selector instead
// TODO: update it if the provider disconnects
const statusConnected = document.createElement('span')

const statusTokenAddress = document.createElement('span')
statusTokenAddress.append(
    document.createTextNode('rETH address:'),
    document.createElement('br'),
    document.createTextNode(await rocketToken.getAddress())
)

const statusBlockNumber = document.createElement('span')
let blockNumberNode = document.createTextNode('loading...')
statusBlockNumber.append(
    document.createTextNode('block number:'),
    document.createElement('br'),
    blockNumberNode
)
async function updateBlockNumber() {
    const newNode = document.createTextNode(
        await provider.getBlockNumber().then(n => n.toString()))
    statusBlockNumber.replaceChild(newNode, blockNumberNode)
    blockNumberNode = newNode
}
statusConnected.append(
    document.createTextNode('network:'),
    document.createElement('br'),
    document.createTextNode(await provider.getNetwork().then(n => n.name))
)
await updateBlockNumber()

const statusUpdateControl = document.createElement('span')
const statusUpdateLabel = document.createElement('label')
const statusUpdateCheckbox = document.createElement('input')
const statusUpdateButton = document.createElement('input')
statusUpdateCheckbox.type = 'checkbox'
statusUpdateButton.type = 'button'
statusUpdateButton.value = 'Update'
statusUpdateCheckbox.setAttribute('checked', '')
statusUpdateButton.classList.add('hidden')
let statusUpdateText = document.createTextNode('auto-update:')
statusUpdateLabel.append(
    statusUpdateText,
    document.createElement('br'),
    statusUpdateCheckbox,
)
statusUpdateControl.append(
    statusUpdateLabel,
    statusUpdateButton
)

statusDiv.innerText = ''
statusDiv.append(
    statusConnected,
    statusTokenAddress,
    statusBlockNumber,
    statusUpdateControl

)


















const rocketSwapRouterAddress = '0x16d5a408e807db8ef7c578279beeee6b228f1c1c' // TODO: alternative for other networks
const rocketSwapRouter = new ethers.Contract(rocketSwapRouterAddress,
    ['function swapTo(uint256 _uni, uint256 _bal, uint256 _min, uint256 _ideal) payable',
        'function swapFrom(uint256 _uni, uint256 _bal, uint256 _min, uint256 _ideal, uint256 _in)',
        'function optimiseSwapTo(uint256 _in, uint256 _steps) view returns (uint256[2] _portions, uint256 _out)',
        'function optimiseSwapFrom(uint256 _in, uint256 _steps) view returns (uint256[2] _portions, uint256 _out)',
        'function uniswapQuoter() view returns (address)',
        'function WETH() view returns (address)'],
    provider)

const uniswapQuoter = new ethers.Contract(await rocketSwapRouter.uniswapQuoter(),
    ['function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 priceLimit) returns (uint256)'],
    provider)
const WETH = await rocketSwapRouter.WETH()
const uniswapFee = 500
const oneEther = ethers.parseEther('1')
const primaryPriceSpan = document.createElement('span')
const secondaryPriceSpan = document.createElement('span')
rETHPricesDiv.classList.add('prices')
rETHPricesDiv.append(primaryPriceSpan, secondaryPriceSpan)
async function updatePrices() {
    primaryPriceSpan.innerText += ' loading...'
    secondaryPriceSpan.innerText += ' loading...'
    const primaryPrice = await rocketToken.getExchangeRate()
    primaryPriceSpan.innerText = `Primary: 1 rETH = ${ethers.formatEther(primaryPrice)} ETH`
    const secondaryPrice = await uniswapQuoter.quoteExactInputSingle.staticCall(
        await rocketToken.getAddress(), WETH, uniswapFee, oneEther, 0)
    secondaryPriceSpan.innerText = `Uniswap: 1 rETH = ${ethers.formatEther(secondaryPrice)} ETH`
    // TODO: display premium/discount %
    // TODO: allow swapping direction?
    // TODO: put numbers in readonly inputs?
}
await updatePrices()

async function onBlockUpdate() {
    await updateBlockNumber()
    await updateBalances()
    await updatePrices()
}

await provider.addListener('block', onBlockUpdate)
statusUpdateCheckbox.addEventListener('change', () => {
    if (statusUpdateCheckbox.checked) {
        const newText = document.createTextNode('auto-update:')
        statusUpdateLabel.replaceChild(newText, statusUpdateText)
        statusUpdateText = newText
        statusUpdateButton.classList.add('hidden')
        onBlockUpdate().then(() => provider.addListener('block', onBlockUpdate))
    }
    else {
        const newText = document.createTextNode('control:')
        statusUpdateLabel.replaceChild(newText, statusUpdateText)
        statusUpdateText = newText
        statusUpdateButton.classList.remove('hidden')
        provider.removeAllListeners('block')
    }
}, { passive: true })

statusUpdateButton.addEventListener('click', onBlockUpdate, { passive: true })

wcEthereum.on('connect', (x) => console.log(`wcEthereum connected ${x}`))

try {
    await wcEthereum.connect()
}
catch (err) {
    console.error(err)
}


//Display functionality for MINT/BURN, controlling the interface



// TODO: form to mint (stake ETH) rETH




/*const mint = async () => {
    const quantity = 1;
    etherscanLinkEL.style.display = "none";
    openseaLinkEL.style.display = "none";

    mintBtn.innerHTML = "Minting...";
    mintBtn.disabled = true;

    if (ethereum && isMetamaskInstalled) {

        try {

            const _quantity = ethers.utils.formatUnits(quantity, 0);
            const accounts = await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const _contract = new ethers.Contract(CONTRACT_ADDRESS,
                ERC721A_ABI, signer);

            const fetchCost = await _contract.cost();
            const _cost = ethers.utils.formatEther(fetchCost);
            const _total = ethers.utils.parseEther(`${_cost}`).mul(_quantity);
            debugger;

            const tx = await _contract.mint(_quantity, {
                gasPrice: 20e9,
                value: _total
            });


            console.log(`Transaction hash: ${tx.hash}`);

            const tx_hash = await tx.wait();
            console.log('TRANSACTION ------------////');
            console.log(tx_hash);
            successMessageEl.innerHTML = "Successfully Minted";
            mintBtn.innerHTML = "Mint";
            mintBtn.disabled = false;

             console.log(`Transaction confirmed in block ${tx.bloc}`);
             console.log(`Gas used: ${tx_hash.gasUsed.toString()}`);

            etherscanLinkEL.setAttribute("href", `https://rinkeby.etherscan.io/tx/${tx.hash}`);
            etherscanLinkEL.style.display = "block";

            // openseaLinkEL.setAttribute("href", `https://testnets.opensea.io/account`);
            const _opensea_url =
                `https://testnets.opensea.io/assets/${String(CONTRACT_ADDRESS).toLocaleLowerCase()}/${_totalSupply}`;
            openseaLinkEL.setAttribute("href", _opensea_url);
            console.log('OPENSEA URL -----------///');
            console.log(_opensea_url);

            openseaLinkEL.style.display = "block";
            await contractUpdate();

        } catch (e) {
            errorMessageEl.innerHTML = `${e.message}`;
            mintBtn.innerHTML = "Mint";
            mintBtn.disabled = false;
        }
    } else {
        mintBtn.innerHTML = "Mint"
        errorMessageEl.innerHTML = "Please Install Metamask.";
        mintBtn.disabled = false;

    }
} */




// TODO: form to burn (unstake ETH) rETH
// TODO: allowance of swap contract for rETH when unstaking
// preview amounts swapped via which routes, fees and gas fees etc.

// TODO: show all rETH allowances and option to revoke?

// TODO: display NO status

// account under consideration (can be the connected one, or other custom)
// connected account (if any)
// connected provider (can be from browser / connected account, or custom RPC)
// liquid staker info (as below)
// info if a NO or minipool or withdrawal or whatever

// liquid stakers / any wallet:
// rETH mint
// rETH burn
// previews for the above
// info on deposit pool current status?
// gas and economical viability estimation for the above
// rETH staking returns historical view
// rETH staking returns projection estimator

// requiring a node (leave for later / separate site):
// withdrawal address confirmation (and view)
// stake on behalf
// stake on behalf allowlist management? or at least view?
// RPL v1->v2 migration




