import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

const LeaguageManagement = () => {
    const [formData, setFormData] = useState({
        file: null,
        textInput: ''
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value // if the input type is file, use files[0], otherwise use value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log("Form Data:", formData);
        // You can now send formData to your API or perform other actions
    };

    return (
        <div className='d-flex justify-content-around'>
            <div className='d-flex flex-column '>
                <img width={300} height={300} src='https://www.cityofredlands.org/sites/main/files/imagecache/medium/main-images/pickleball_leagues.png?1714726581'></img>
                <span className='text-center'><i>Ảnh giải đấu</i></span>
            </div>
            <div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Ảnh giải đấu</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Tên giải đấu</Form.Label>
                        <Form.Control

                            type="text"
                            placeholder="Nhập tên giải đấu"
                            aria-label="Disabled input example"
                            name="textInput"
                            value={formData.textInput}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Địa điểm</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập địa chỉ giải đấu"
                            aria-label="Disabled input example"
                            name="textInput"
                            value={formData.textInput}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className='d-flex justify-content-center'>
                    <Button type='submit'>Cập nhật</Button>

                    </Form.Group>
                </Form>
            </div>
        </div>
    )
};
export default LeaguageManagement;