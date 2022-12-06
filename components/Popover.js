import React, { forwardRef } from 'react';
import Menu, {
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

const Popover = forwardRef(({
  TriggerComponent, children, triggerProps, backgroundColor = '#FFFFFF', placement = 'bottom',
}, ref) => {
  return (
    <>
      <Menu
        ref={ref}
        renderer={renderers.Popover}
        rendererProps={{ placement, anchorStyle: { backgroundColor }}}
      >
        <MenuTrigger {...triggerProps}>
          <TriggerComponent />
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{
            backgroundColor,
            padding: 10,
            borderRadius: 5,
          }}
        >
          <MenuOption>
            {children}
          </MenuOption>
        </MenuOptions>
      </Menu>
    </>
  )
})

export default Popover
