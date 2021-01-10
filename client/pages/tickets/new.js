import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const INIT_STATE = {
    title: "",
    price: "",
  };
  const [formData, setFormData] = useState(INIT_STATE);
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { ...formData },
    onSuccess: () => Router.push('/'),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    // keep old data except newly updated data
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleBlur();   // check and round price input

    doRequest();
  };

  const handleBlur = () => {
    const value = parseFloat(formData.price);
    // check if price is a number
    if (!isNaN(formData.price) && !isNaN(value)) {
      setFormData(f => ({ ...f, price: value.toFixed(2) }));
    }
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title-input">Title</label>
          <input
            id="title-input"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price-input">Price</label>
          <input
            id="price-input"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;