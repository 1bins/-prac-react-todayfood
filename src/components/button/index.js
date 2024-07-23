const Button = ({children, onClick, shape}) => {
  return(
      <button
          type="button"
          className={shape}
          onClick={onClick}
      >{children}</button>
  )
}

export default Button;