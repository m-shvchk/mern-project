const FormRow = ({ type, name, id, value, handleChange, labelText, placeholder }) => {
    return (
      <div className='form-row'>
        <label htmlFor={name} className='form-label'>
          {labelText || name}
        </label>
  
        <input
          type={type}
          value={value}
          name={name}
          id={id}
          onChange={handleChange}
          placeholder={placeholder || ''}
          className='form-input'
        />
      </div>
    )
  }
  
  export default FormRow