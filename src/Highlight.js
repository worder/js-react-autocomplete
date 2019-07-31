import React from 'react'
import PropTypes from 'prop-types'

const hl = (string, hlValue, CompNorm, CompHl, compProps, acc = [], keySeed = 0) => {
  let keySeedContinue = keySeed
  if (string.length > 0 && hlValue.length > 0) {
    const hlEntryIdx = string.indexOf(hlValue)
    const hlExitIdx = hlEntryIdx + hlValue.length
    if (hlEntryIdx > -1) {
      const nextAcc = [
        ...acc,
        ...(hlEntryIdx > 0
          ? [<CompNorm key={(keySeedContinue += 1)}>{string.substr(0, hlEntryIdx)}</CompNorm>]
          : []),
        <CompHl key={(keySeedContinue += 1)} {...compProps}>
          {string.substr(hlEntryIdx, hlValue.length)}
        </CompHl>,
      ]
      return hl(
        string.substr(hlExitIdx),
        hlValue,
        CompNorm,
        CompHl,
        compProps,
        nextAcc,
        keySeedContinue,
      )
    }
  }

  return [...acc, <CompNorm key={keySeedContinue + 1}>{string}</CompNorm>]
}

const Highlight = ({ children, value, as, normAs, ...props }) => (
  <React.Fragment>{hl(children, value, normAs, as, props)}</React.Fragment>
)

Highlight.propTypes = {
  children: PropTypes.string,
  value: PropTypes.string,
  as: PropTypes.node,
  normAs: PropTypes.node,
}

Highlight.defaultProps = {
  value: '',
  children: '',
  as: 'mark',
  normAs: 'span',
}

export default Highlight
