export const numberToShortString = (number) => {
  if (number > 1000000) {
    return (Math.trunc(number / 100000) / 10).toString() + 'M'
  } else if (number > 1000) {
    return (Math.trunc(number / 100) / 10).toString() + 'K'
  } else {
    return number.toString()
  }
}

export const formatBalance = (number, digits) => {
  let d = digits ? digits : 100000
  return Math.trunc(d * Math.max(number, 0)) / d
}
