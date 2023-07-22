$(document).ready(function () {
  function convertGender(gender) {
    switch (gender) {
      case 0:
        return "khác";
      case 1:
        return "Nam";
      case 2:
        return "Nữ";
      default:
        return "Không xác định";
    }
  }

  $.ajax({
    url: "https://cukcuk.manhnv.net/api/v1/Customers",
    type: "GET",
    success: function (data) {
      // Các key bạn muốn kiểm tra giá trị null hoặc "string"
      var keysToCheck = [
        "CustomerCode",
        "FullName",
        "Gender",
        "Address",
        "DateOfBirth",
        "Email",
        "PhoneNumber",
        "DebitAmount",
        "CompanyName",
      ];

      // Loại bỏ các item mà có bất kỳ key nào trong keysToCheck có giá trị null hoặc undefined hoặc "string"
      data = data.filter(function (item) {
        return keysToCheck.every(function (key) {
          return (
            item[key] !== null &&
            item[key] !== undefined &&
            item[key] !== "string" &&
            item[key] !== ""
          );
        });
      });

      console.log(data.length);
      // Tạo một dòng mới cho mỗi đối tượng dữ liệu
      data.forEach(function (item) {
        const row =
          "<tr>" +
          "<td>" +
          item.CustomerCode +
          "</td>" +
          "<td>" +
          item.FullName +
          "</td>" +
          "<td>" +
          convertGender(item.Gender) +
          "</td>" +
          "<td>" +
          new Date(item.DateOfBirth).toLocaleDateString() +
          "</td>" +
          "<td>" +
          item.PhoneNumber +
          "</td>" +
          "<td>" +
          item.Email +
          "</td>" +
          "<td>" +
          item.Address +
          "</td>" +
          "<td>" +
          item.CompanyName +
          "</td>" +
          "<td>" +
          item.DebitAmount +
          "</td>" +
          "<td>" +
          "Chưa cập nhật" +
          "</td>" +
          "<td class='delete-button'>" + // Thêm một cột mới cho nút "Xóa"
          "<i class='far fa-trash-alt'" +
          "</i>" +
          "</td>" +
          "</tr>";
        // Thêm dòng vào bảng
        $(".table-body tbody").append(row);
      });

      // Xử lý sự kiện khi click vào nút xóa khách hàng
      $(".table-body tbody").on("click", ".delete-button i", function () {
        // Nếu đã có một modal, không tạo thêm
        if ($(".modal").length) {
          return;
        }

        // Lưu trữ dòng hiện tại vào biến
        const rowToDelete = $(this).closest("tr");

        //Tạo overlay
        const overlay = $('<div id="overlay"></div>');
        // Tạo modal
        const modal = $(
          '<div class="modal">' +
            '<img class="modal-close" src="./icon/x.svg" alt="this-is-icon">' +
            '<div class="modal-wrapper">' +
            '<div class="modal-top">' +
            "<h2>Pop-up Thông báo</h2>" +
            "</div>" +
            '<div class="modal-content">' +
            '<i class="fas fa-exclamation-triangle"></i>' +
            "<span>Bạn có chắc muốn xoá khách hàng này không ?</span>" +
            "</div>" +
            "</div>" +
            '<div class="modal-bottom modal-bottom--warning">' +
            '<button class="modal-bottom__close">Huỷ</button>' +
            '<button class="modal-bottom__remove">Xoá</button>' +
            "</div>" +
            "</div>"
        );

        // Trong hàm xử lý sự kiện click
        modal.addClass("show");
        overlay.addClass("show");

        // Chèn modal vào body
        $("body").append(modal, overlay);

        // Xử lý sự kiện click cho nút "Xóa" trong modal
        modal.find(".modal-bottom__remove").on("click", function () {
          rowToDelete.remove();
          modal.addClass("hide");
          modal.remove();
          overlay.removeClass("show");
        });

        // Xử lý sự kiện click cho nút "Huỷ" hoặc biểu tượng "X"
        modal
          .find(".modal-bottom__close, .modal-close")
          .on("click", function () {
            modal.addClass("hide");
            modal.remove();
            overlay.removeClass("show");
          });
      });
    },
    error: function (error) {
      $(".table-body tbody").append(
        `<span class='error-api'><i class="fas fa-exclamation-triangle"></i> Lỗi không thể lấy dữ liệu từ api vui lòng báo cho admin trang web !</span>`
      );
    },
  });
});
