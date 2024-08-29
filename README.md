<div align="center">

<h1>Fuzion</h1>
<img src="./assets/logo.png" alt="Fuzion Logo" width="200" height="200" />
<h3>Easy way to manage ZKsync Paymasters</h3>
<a href="https://app.akindo.io/communities/83VVgQEVBiwvgw3a/products/WjW1oLrd2UNe02xB">AKINDO</a>
</div>

## Table of Contents

- [Introduction](#introduction)
- [Inspiration](#inspiration)
- [Features](#features)
- [Paymaster Structure](#paymaster-structure)
- [Progress](#progress)
- [Installation](#installation)
- [License](#license)
- [Contributions](#contributions)

## Introduction

Fuzion is a simple and easy way to deploy and manage ZKsync paymasters. It is a web application that allows developers to deploy paymasters on ZKsync with a few clicks. The paymaster is designed in a composable way, making it easy to manage and update the paymaster.

## Inspiration

I found that most of the projects just use the basic paymaster provided by ZKsync. But we can do a lot more with the paymaster and have to consider different use cases like user verification, payment processing, and other custom logic. So, I decided to build a platform that allows developers to deploy and manage paymasters easily. This will help developers to focus on their core product and not worry about the paymaster.

## Features

### Deploy Paymaster

Deploy Paymaster on ZKsync with a few clicks. Just enter the required details and click on the create button.

### Manage Paymaster

Deployed paymasters can be managed easily. You can view the list of paymasters, details of the paymaster, and update the paymaster.

### Composable Paymaster

The Paymaster is designed in a composable way. It is divided into different modules like Validator, Payport, and Hook. This makes it easy to manage and update the Paymaster.

### Modules

Anyone can create and register their own modules. These modules can be used in the Paymaster to add custom logic.

## Paymaster Structure

![Fuzion Paymaster Structure](./assets/fuzion-paymaster-structure.png)

This diagram illustrates the structure of the `FuzionPaymaster` smart contract. The process is divided into two main stages: `validateAndPayForPaymasterTransaction` and `postTransaction`. Each stage involves various modules (Validator, Payport, Hook) that execute specific tasks. Below is a step-by-step explanation of how the function operates.

### 1. `validateAndPayForPaymasterTransaction`

This function is responsible for validating the transaction and processing the payment. The process follows these steps:

- **Hook: preCheck**

  - In this step, a pre-check is performed to ensure the transaction meets initial conditions before processing.

- **Validator: validateTransaction**

  - This step validates the transaction up to 5 times using different Validator modules. This can include checking the transaction’s signature, nonce, gas requirements, and other parameters.

- **Payport: preparePayment**

  - Once the transaction is validated, this step prepares the payment by setting the payment context and gathering necessary information. The payment can be made in ETH or ERC20 tokens based on the paymaster input selector.

- **Paymaster: \_payForPaymasterTransaction**

  - After preparing the payment, the payment is processed and transferred to the bootloader by the paymaster.

- **Hook: postCheck**
  - A post-check is conducted after the transaction is completed to ensure everything was processed correctly. Additional actions can be taken in this step.

### 2. `postTransaction`

This function handles any post-transaction tasks that might be necessary after a transaction is successfully processed:

- **Payport: prepareRefund**

  - If the payment was done in ERC20 tokens, maybe the refund is required because of overcharging or any other reason. This step prepares the refund by taking the payment data from the context.

- **Paymaster: \_refund**
  - The refund is processed and transferred to the user by the paymaster.

### Module Descriptions

- **Validator (Blue)**: Validates the transaction through various checks.
- **Payport (Pink)**: Prepares payments and refunds.
- **Hook (Yellow)**: Manages pre- and post-transaction checks and allows for additional logic to be implemented.

### Note on Payment and Refund

The actual payment and refund are handled by the Paymaster contract. Because modules are designed to be called externally to prevent the storage collision and other possible errors by using the delegatecall method, the payment and refund are done by the Paymaster contract.

### Why default modules are required?

In the case of modular account, the user can choose which module to call when initiating the transaction. But in the case of the paymaster, the paymaster contract is the one that calls the modules and pays for the transaction. Thus, the paymaster contract needs to know which module to call not the user. That's why the default modules are defined in the FuzionPaymaster contract. It should be controlled by the admin of the paymaster not the user.

## Progress

- [x] Basic UI Design
- [x] Wallet Connection and Login
- [x] Design Paymaster Structure
- [x] Paymaster Deployment on web app
- [x] Paymaster List by User
- [ ] Paymaster Details
- [ ] Paymaster Module Registration
- [ ] Paymaster Update

## Installation

1. Clone the repository

```bash
git clone https://github.com/piatoss3612/ZKsync-fuzion.git
```

2. Install the dependencies

```bash
cd frontend && yarn install
```

3. Run the application

```bash
yarn dev
```

4. Open the application in the browser

```bash
http://localhost:3000
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributions

If you have any suggestions or improvements, feel free to create an issue or a pull request. This project is open for contributions. 🚀
