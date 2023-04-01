# google-lens-electron

This application allows you to use Google Lens in an Electron window outside of your browser, along with a dedicated screenshot button.

## Installation

To use this application, you need to have Node.js and Electron installed on your computer. You also need to have the screenshot utility 'ksnip' installed, which can be installed with Chocolatey using the following command:
```
choco install ksnip.install
```
Once you have installed ksnip, you can install this application by cloning the repository and running the following commands in the project directory:

```
npm install
npm start
```
This will launch the application in an Electron window.

## Usage

To use Google Lens in the application, simply drag a file into the window, or use the top right menu to open a file upload dialog.

To take a screenshot of your current display, click on the Screenshot button in the top left. This will capture the image and upload it to Lens.

## Dependencies

This application uses the following dependencies:

- Electron
- Axios

## License

This application is licensed under the MIT license.
