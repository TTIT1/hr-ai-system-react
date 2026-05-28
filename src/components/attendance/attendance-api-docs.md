# Attendance API Docs

Base URL: `/api/attendance`

Màn này dùng để upload file Excel chấm công, backend tự tính công, lưu dữ liệu chi tiết vào `attendance_records`, lưu dữ liệu tổng hợp để hiển thị bảng vào `attendance_summary`.

## Quy Tắc Tính Công

Backend tính theo `checkIn`, `checkOut`, và thứ trong tuần:

| Điều kiện | Score |
|---|---:|
| Thứ 7 hoặc Chủ nhật | `0.0` |
| Thiếu check-in hoặc check-out | `0.0` |
| Tổng thời gian dưới 2 giờ | `0.0` |
| Làm đủ từ 8 giờ trở lên | `1.0` |
| Nghỉ chiều, chỉ làm sáng: vào `08:30-09:00`, ra `11:30-13:00` | `0.4` |
| Nghỉ sáng, chỉ làm chiều: vào `12:00-13:30`, ra `17:30-18:00` | `0.6` |
| Không khớp các điều kiện trên | `0.0` |

Lưu ý: các mức `0.8` là dữ liệu cũ trước khi sửa logic. Upload/process lại file Excel thì dữ liệu mới chỉ còn `0.0`, `0.4`, `0.6`, `1.0`.

## Excel Input

Upload file `.xlsx`.

Backend tự dò các cột:

| Cột trong Excel | Ý nghĩa |
|---|---|
| `Mã nhân viên` | `employeeId` |
| `Tên nhân viên` | `employeeName` |
| `Phòng ban` | `department` |
| Cặp cột `Vào` / `Ra` dưới từng ngày | `checkIn` / `checkOut` |

Backend đọc ngày từ header phía trên cặp `Vào/Ra`, nên file có thể bắt đầu từ ngày 7, ngày 10... không bắt buộc từ ngày 1.

Format giờ hỗ trợ:

```text
08:30
8:30
08h30
```

## Database Objects

### AttendanceRecord

Lưu chi tiết từng nhân viên từng ngày trong bảng `attendance_records`.

```json
{
  "id": 1,
  "employeeId": "2603168",
  "employeeName": "Nguyen Van A",
  "department": "Du an AI",
  "workDate": "2026-05-07",
  "checkIn": "08:37",
  "checkOut": "17:40",
  "score": 1.0,
  "month": 5,
  "year": 2026
}
```

Unique key:

```text
employee_id + work_date
```

Khi upload lại cùng `month/year`, backend xóa dữ liệu cũ của tháng đó rồi insert lại.

### AttendanceSummary

Lưu tổng hợp từng nhân viên theo tháng trong bảng `attendance_summary`.

```json
{
  "id": 1,
  "employeeId": "2603168",
  "employeeName": "Nguyen Van A",
  "department": "Du an AI",
  "month": 5,
  "year": 2026,
  "dailyScores": "{\"1\":0.0,\"2\":0.0,\"7\":1.0}",
  "totalScore": 12.6
}
```

Trong DB, `dailyScores` là string JSON. Khi gọi API `/summary` và `/summary/employee/{employeeId}`, backend parse thành object:

```json
"dailyScores": {
  "1": 0.0,
  "2": 0.0,
  "7": 1.0
}
```

Unique key:

```text
employee_id + month + year
```

## 1. Upload Excel Và Tính Công

`POST /api/attendance/calculate`

Content-Type:

```text
multipart/form-data
```

Query params:

| Param | Type | Required | Default | Note |
|---|---:|---:|---:|---|
| `year` | number | no | `2026` | Năm chấm công |
| `month` | number | no | `5` | Tháng chấm công |

Form data:

| Field | Type | Required | Note |
|---|---|---:|---|
| `file` | file | yes | File Excel `.xlsx` |

Example:

```http
POST /api/attendance/calculate?year=2026&month=5
Content-Type: multipart/form-data
```

Response `200 OK`:

```json
{
  "message": "Xử lý thành công",
  "savedRecords": 50,
  "savedSummaries": 2,
  "totalEmployees": 2
}
```

Ý nghĩa:

| Field | Meaning |
|---|---|
| `savedRecords` | Số dòng chi tiết đã lưu vào `attendance_records` |
| `savedSummaries` | Số dòng tổng hợp đã lưu vào `attendance_summary` |
| `totalEmployees` | Số nhân viên đọc được từ Excel |

Response lỗi `400 Bad Request`:

```json
{
  "error": "Không tìm thấy header Excel gồm Mã nhân viên, Tên nhân viên và cặp cột Vào/Ra."
}
```

## 2. Upload Excel Và Download File Kết Quả

`POST /api/attendance/calculate/export`

Content-Type:

```text
multipart/form-data
```

Query params giống API calculate:

| Param | Type | Required | Default |
|---|---:|---:|---:|
| `year` | number | no | `2026` |
| `month` | number | no | `5` |

Form data:

| Field | Type | Required |
|---|---|---:|
| `file` | file | yes |

Response `200 OK`:

Headers:

```http
Content-Disposition: attachment; filename=cham_cong_5_2026.xlsx
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

Body: binary Excel file.

Frontend xử lý dạng blob:

```js
const formData = new FormData();
formData.append("file", file);

const res = await fetch("/api/attendance/calculate/export?year=2026&month=5", {
  method: "POST",
  body: formData
});

const blob = await res.blob();
```

Response lỗi: `400 Bad Request`, body rỗng.

## 3. Lấy Bảng Tổng Hợp Theo Tháng

`GET /api/attendance/summary`

Query params:

| Param | Type | Required | Default |
|---|---:|---:|---:|
| `year` | number | no | `2026` |
| `month` | number | no | `5` |

Example:

```http
GET /api/attendance/summary?year=2026&month=5
```

Response `200 OK`:

```json
[
  {
    "employeeId": "2603168",
    "employeeName": "Nguyen Van A",
    "department": "Du an AI",
    "totalScore": 12.6,
    "dailyScores": {
      "1": 0.0,
      "2": 0.0,
      "3": 1.0,
      "4": 0.4,
      "5": 0.6,
      "6": 1.0
    }
  }
]
```

Frontend render bảng:

| Field | Meaning |
|---|---|
| `employeeId` | Mã nhân viên |
| `employeeName` | Tên nhân viên |
| `department` | Phòng ban |
| `totalScore` | Tổng công trong tháng |
| `dailyScores["1"]` | Công ngày 1 |
| `dailyScores["2"]` | Công ngày 2 |

Lưu ý: `dailyScores` chỉ có các ngày backend đọc được từ Excel. Nếu file chỉ có ngày 7-31, object có thể chỉ có key `7` tới `31`.

Response lỗi `400 Bad Request`:

```json
{
  "error": "message lỗi"
}
```

## 4. Lấy Tổng Hợp Theo Phòng Ban

`GET /api/attendance/summary/department`

Query params:

| Param | Type | Required | Default |
|---|---:|---:|---:|
| `department` | string | yes | |
| `year` | number | no | `2026` |
| `month` | number | no | `5` |

Example:

```http
GET /api/attendance/summary/department?department=Du%20an%20AI&year=2026&month=5
```

Response `200 OK`:

```json
[
  {
    "id": 1,
    "employeeId": "2603168",
    "employeeName": "Nguyen Van A",
    "department": "Du an AI",
    "month": 5,
    "year": 2026,
    "dailyScores": "{\"1\":0.0,\"2\":1.0}",
    "totalScore": 12.6
  }
]
```

Lưu ý cho frontend: API này đang trả entity trực tiếp, nên `dailyScores` là string JSON, khác với `/summary` là object. Nếu cần render bảng, frontend cần:

```js
const dailyScores = JSON.parse(item.dailyScores || "{}");
```

## 5. Lấy Tổng Hợp Của Một Nhân Viên

`GET /api/attendance/summary/employee/{employeeId}`

Path params:

| Param | Type | Required |
|---|---:|---:|
| `employeeId` | string | yes |

Query params:

| Param | Type | Required | Default |
|---|---:|---:|---:|
| `year` | number | no | `2026` |
| `month` | number | no | `5` |

Example:

```http
GET /api/attendance/summary/employee/2603168?year=2026&month=5
```

Response `200 OK`:

```json
{
  "employeeId": "2603168",
  "employeeName": "Nguyen Van A",
  "department": "Du an AI",
  "totalScore": 12.6,
  "dailyScores": {
    "1": 0.0,
    "2": 1.0,
    "3": 0.4,
    "4": 0.6
  }
}
```

Response nếu không có dữ liệu:

```http
404 Not Found
```

Response lỗi parse hoặc server:

```http
500 Internal Server Error
```

## 6. Test Tính Công Một Ngày

`GET /api/attendance/single`

Query params:

| Param | Type | Required | Example |
|---|---:|---:|---|
| `checkIn` | string | yes | `08:37` |
| `checkOut` | string | yes | `17:40` |
| `dayOfWeek` | string | yes | `MONDAY` |

`dayOfWeek` dùng enum Java:

```text
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
SATURDAY
SUNDAY
```

Example:

```http
GET /api/attendance/single?checkIn=08:37&checkOut=17:40&dayOfWeek=MONDAY
```

Response `200 OK`:

```json
{
  "checkIn": "08:37",
  "checkOut": "17:40",
  "dayOfWeek": "MONDAY",
  "score": 1.0
}
```

Examples theo rule hiện tại:

| Request | Score |
|---|---:|
| `08:37` - `17:40`, `MONDAY` | `1.0` |
| `08:37` - `12:00`, `MONDAY` | `0.4` |
| `13:00` - `17:40`, `MONDAY` | `0.6` |
| `08:37` - `17:40`, `SATURDAY` | `0.0` |
| thiếu check-in hoặc check-out | `0.0` |

Response lỗi `400 Bad Request`:

```json
{
  "error": "Text '8h30' could not be parsed at index 1"
}
```

Lưu ý: API `/single` dùng `LocalTime.parse`, nên frontend nên gửi `HH:mm`, ví dụ `08:30`, không gửi `8h30`.

## Gợi Ý State Cho Frontend

Màn danh sách tổng hợp nên dùng API:

```http
GET /api/attendance/summary?year=2026&month=5
```

State mẫu:

```js
{
  year: 2026,
  month: 5,
  rows: [
    {
      employeeId: "2603168",
      employeeName: "Nguyen Van A",
      department: "Du an AI",
      totalScore: 12.6,
      dailyScores: {
        "1": 0,
        "2": 1,
        "3": 0.4
      }
    }
  ]
}
```

Render cột ngày:

```js
const daysInMonth = new Date(year, month, 0).getDate();
const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

const value = row.dailyScores[day] ?? 0;
```

Màn upload:

```js
const formData = new FormData();
formData.append("file", file);

const res = await fetch(`/api/attendance/calculate?year=${year}&month=${month}`, {
  method: "POST",
  body: formData
});

const data = await res.json();
```

