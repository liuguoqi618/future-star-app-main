import React, {createContext, useReducer} from 'react'

export const GlobalContext = createContext()

export default function GlobalProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalContext.Provider>
  )
}

const initialState = {
  isLoggedIn: false,
  avatarUrl: '',
  username: '',
  phoneNumber: '',
  activity: 0,
  email: '',
  inviteCode: '',
  steps: 0,
  targetSteps: 4000,
  verificationStatus: -1,
  starLevel: -1,
}

const reducer = (state, action) => {
  const {type, value} = action

  // console.log('GLOBAL CONTEXT ACTION: ', action.type)

  switch (type) {
    case 'LOG_IN':
      return {
        ...state,
        isLoggedIn: true,
        username: action.data.username,
        phoneNumber: action.data.phoneNumber,
        avatarUrl: action.data.avatarUrl,
        email: action.data.email,
        inviteCode: action.data.inviteCode,
        verificationStatus: action.data.verificationStatus,
        starLevel: action.data.starLevel,
      }
    case 'CHANGE_AVATAR':
      return {
        ...state,
        avatarUrl: action.data.avatarUrl,
      }
    case 'CHANGE_USERNAME':
      return {
        ...state,
        username: action.data.username,
      }
    case 'SET_ACTIVITY_PROGRESS':
      return {
        ...state,
        activity: action.data.activity,
      }
    case 'SET_INVITE_CODE':
      return {
        ...state,
        inviteCode: action.data.inviteCode,
      }
    case 'SET_STEPS':
      return {
        ...state,
        steps: action.data.steps,
      }
    case 'SET_VERIFICATION_STATUS':
      return {
        ...state,
        verificationStatus: action.data.verificationStatus,
      }
    case 'SET_STAR_CARD':
      return {
        ...state,
        starLevel: action.data.starLevel,
      }
    case 'LOG_OUT':
      return initialState
    default:
      return state
  }
}
