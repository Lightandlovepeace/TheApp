//import {PermissionsAndroid, Platform} from 'react-native';

// import { useState } from "react";
// import { BleManager, Device} from "react-native-ble-plx";

// const bleManager = new BleManager();

// export default function useBLE() {
//     const [allDevices, setAllDevices] = useState(Device);
//     const isDuplicateDevice = (devices, nextDevice) => {
//         devices.findIndex(device => nextDevice.id === device.id)> -1;
//     }

//     const scanForDevices = () => {
//         bleManager.startDeviceScan(null, null, (error, device) => {
//             if (error) {
//                 console.log(error);
//             }
//             if (device) {
//                 //add device
//                 setAllDevices((previoState) => {
//                     if (!isDuplicateDevice(previoState, device)) {
//                         return [...previoState, device];
//                     }
//                     return previoState;
//                 });
//             }
//         })
//     }
// }