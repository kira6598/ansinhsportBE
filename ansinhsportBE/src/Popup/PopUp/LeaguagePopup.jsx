import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import {
  addLeaguage,
  getLeaguageById,
} from "../../feature/Leaguage/LeaguageAPI";
const ligoHost = import.meta.env.VITE_HOST_API;

function formatDate(dateString) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Get the month, day, and year
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  // Format the date as mm/dd/yyyy
  return `${day}/${month}/${year}`;
}
const LeaguagePopup = ({ isShow, LeaguageId, isCreateNew, onClose }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  console.log(LeaguageId);

  const [formData, setFormData] = useState({
    file: null,
    LeaguageName: "",
    LeaguageAddress: "",
    StartDate: new Date(),
    EndDate: new Date(),
    ImageUrl: "",
  });
  useEffect(() => {
    setShow(isShow);
  }, [isShow]);
  useEffect(() => {
    const fetchData = async (id) => {
      var ret = await dispatch(getLeaguageById(id));
      if (ret.type === "Leaguage/getLeaguageById/fulfilled") {
        setFormData({
          ...formData,
          LeaguageAddress: ret?.payload?.data?.LeaguageAddress,
          LeaguageName: ret?.payload?.data?.LeaguageName,
          StartDate: formatDate(ret?.payload?.data?.StartDate),
          EndDate: formatDate(ret?.payload?.data?.EndDate),
          ImageUrl: ligoHost + ret?.payload?.data?.ImageUrl,
        });
      } else {
        toast.error("không tìm thấy giải đấu", { theme: "colored" });
      }
    };

    fetchData(LeaguageId);
  }, [LeaguageId]);
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // if the input type is file, use files[0], otherwise use value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (formData.LeaguageName.length <= 0) {
      toast.error("Tên giải không được để trống", {
        theme: "colored",
        position: "bottom-right",
      });
      return;
    }
    if (formData.LeaguageAddress.length <= 0) {
      toast.error("Địa điểm tổ chức giải không được để trống", {
        theme: "colored",
        position: "bottom-right",
      });
      return;
    }
    let payload = new FormData();
    payload.append("LeaguageName", formData.LeaguageName);
    payload.append("LeaguageAddress", formData.LeaguageAddress);
    payload.append("Capture", formData.file);
    const ret = await dispatch(addLeaguage(payload));
    if (ret.type === "Leaguage/addLeaguage/fulfilled") {
      toast.success(
        `${isCreateNew ? `Thêm mới` : `Cập nhật`} giải đấu thành công!`,
        { theme: "colored" }
      );
    } else {
      toast.error(
        `Có lỗi xảy ra khi ${isCreateNew ? `Thêm mới` : `Cập nhật`} giải đấu`
      );
    }
    handleClose();
    // You can now send formData to your API or perform other actions
  };
  // const toggle = () => setShow(!show);
  const handleClose = () => {
    setShow(false);
    onClose();
  };
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <ModalHeader closeButton className="text-center">
        {isCreateNew ? "Thêm mới giải đấu" : `Thông tin giải đấu`}
      </ModalHeader>
      <ModalBody>
        <div className="d-flex justify-content-around">
          <div className="d-flex flex-column ">
            <img
              width={300}
              height={300}
              src={
                formData.ImageUrl.length > 0
                  ? formData.ImageUrl
                  : `https://www.cityofredlands.org/sites/main/files/imagecache/medium/main-images/pickleball_leagues.png?1714726581`
              }
            ></img>
            <span className="text-center">
              <i>Ảnh giải đấu</i>
            </span>
          </div>
          <div>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Thay đổi ảnh giải đấu</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="my-2">
                <Form.Label>Tên giải đấu</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên giải đấu"
                  aria-label="Disabled input example"
                  name="LeaguageName"
                  defaultValue={formData.LeaguageName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="my-2">
                <Form.Label>Địa điểm</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ giải đấu"
                  aria-label="Disabled input example"
                  name="LeaguageAddress"
                  defaultValue={formData.LeaguageAddress}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="my-2">
                <Form.Label>Ngày khai mạc</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Nhập ngày khai mạc"
                  aria-label="Disabled input example"
                  name="StartDate"
                  defaultValue={formData.StartDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="my-2">
                <Form.Label>Ngày bế mạc</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Nhập ngày bế mạc "
                  aria-label="Disabled input example"
                  name="EndDate"
                  defaultValue={formData.EndDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="d-flex justify-content-center">
                <Button type="submit">
                  {isCreateNew ? `Thêm mới` : `Cập nhật`}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
LeaguagePopup.propTypes = {
  isShow: PropTypes.bool,
  LeaguageId: PropTypes.number,
  onClose: PropTypes.func,
  isCreateNew: PropTypes.bool,
  // hasRoleApprove: PropTypes.bool,
};
export default LeaguagePopup;
