import React from 'react';
import{AntDesign} from '@expo/vector-icons';
import color from '../misc/color'

const PlayerButton = (props) => {

    const {
        iconType,
        size = 52,
        iconColor = color.FONT,
        onPress,
    } = props
    const getIconName = (type) => {
        switch(type) {
            case 'PLAY':
                return 'pausecircle'; //related to 
            case 'PAUSE':
                return 'playcircleo'; //render related to pause
            case 'NEXT':
                return 'forward'; //render previous
            case 'PREV':
                return 'banckward';
        }
    }
    return (
       <AntDesign 
       onPress={onPress} 
       {...props}
       name = {getIconName(iconType)} 
       size = {size} 
       color ={iconColor}/>
    )
}

export default PlayerButton;
