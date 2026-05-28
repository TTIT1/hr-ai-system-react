# Employee API Docs

Base URL: `/api/employees`

Auth: các API cần user có role `HR` hoặc `ADMIN`.

Response wrapper chung:

```json
{
  "success": true,
  "data": {},
  "message": "optional",
  "httpStatusCode": "optional"
}
```

## Employee Object

```json
{
  "id": "uuid",
  "idemployee": "NV001",
  "full_name": "Nguyen Van A",
  "gender": "Nam",
  "birth_date": "1998-01-20",
  "phone": "0912345678",
  "email": "a@company.com",
  "department_id": "department-uuid",
  "position": "Developer",
  "level": "Junior",
  "manager_level_1": "Tran Van B",
  "manager_level_2": "Le Van C",
  "contract_type": "Hop dong lao dong",
  "contract_effective_date": "2026-01-01",
  "contract_expiry_date": "2026-12-31",
  "review_due_date": "2026-03-01",
  "hire_date": "2026-01-01",
  "resignation_date": null,
  "seniority": "1 nam",
  "permanent_address": "Ha Noi",
  "personal_email": "personal@gmail.com",
  "id_number": "001098765432",
  "id_issue_date": "2020-01-01",
  "id_issue_place": "Cuc CSQLHC ve TTXH",
  "emergency_contact_name": "Nguyen Van B",
  "emergency_contact_relationship": "Bo",
  "emergency_contact_phone": "0987654321",
  "programming_language": "Java, React",
  "major": "Cong nghe thong tin",
  "education_institution": "Dai hoc Bach Khoa",
  "education_level": "Dai hoc",
  "degree_year": 2020,
  "other_it_certificate": "AWS, TOEIC",
  "avatar_url": "",
  "status": "ACTIVE",
  "created_at": "2026-05-27T11:26:31",
  "updated_at": "2026-05-27T11:26:31"
}
```

## 1. List Employees

`GET /api/employees`

Query params:

| Param | Type | Required | Default | Note |
|---|---:|---:|---:|---|
| `status` | string | no | `ACTIVE` | `ACTIVE`, `RESIGNED`, ... |
| `search` | string | no | | Tim theo `fullName` hoac `email` |
| `department` | string | no | | Department id |
| `level` | string | no | | Loc theo level |
| `page` | number | no | `0` | Page bat dau tu 0 |
| `size` | number | no | `20` | So item/page |

Example:

```http
GET /api/employees?status=ACTIVE&page=0&size=20
```

Response:

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "idemployee": "NV001",
        "full_name": "Nguyen Van A",
        "email": "a@company.com",
        "phone": "0912345678",
        "department_id": "department-uuid",
        "position": "Developer",
        "level": "Junior",
        "status": "ACTIVE"
      }
    ],
    "pageable": {},
    "totalElements": 1,
    "totalPages": 1,
    "last": true,
    "size": 20,
    "number": 0,
    "first": true,
    "numberOfElements": 1,
    "empty": false
  }
}
```

## 2. Get Employee Detail

`GET /api/employees/{id}`

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "idemployee": "NV001",
    "full_name": "Nguyen Van A",
    "gender": "Nam",
    "birth_date": "1998-01-20",
    "hire_date": "2026-01-01",
    "status": "ACTIVE"
  }
}
```

`data` tra ve day du field nhu `Employee Object`.

## 3. Create Employee

`POST /api/employees`

Required:

| Field | Note |
|---|---|
| `fullname` | Ten nhan vien. Luu y create hien dang dung `fullname`, khong phai `full_name`. |
| `idemployee` | Ma nhan vien, unique |
| `email` | Email cong ty, unique |
| `hire_date` | Ngay vao lam |
| `department_id` | Department id phai ton tai |

Request body:

```json
{
  "idemployee": "NV001",
  "fullname": "Nguyen Van A",
  "gender": "Nam",
  "birth_date": "1998-01-20",
  "phone": "0912345678",
  "email": "a@company.com",
  "department_id": "department-uuid",
  "position": "Developer",
  "level": "Junior",
  "manager_level_1": "Tran Van B",
  "manager_level_2": "Le Van C",
  "contract_type": "Hop dong lao dong",
  "contract_effective_date": "2026-01-01",
  "contract_expiry_date": "2026-12-31",
  "review_due_date": "2026-03-01",
  "hire_date": "2026-01-01",
  "resignation_date": null,
  "seniority": "1 nam",
  "permanent_address": "Ha Noi",
  "personal_email": "personal@gmail.com",
  "id_number": "001098765432",
  "id_issue_date": "2020-01-01",
  "id_issue_place": "Cuc CSQLHC ve TTXH",
  "emergency_contact_name": "Nguyen Van B",
  "emergency_contact_relationship": "Bo",
  "emergency_contact_phone": "0987654321",
  "programming_language": "Java, React",
  "major": "Cong nghe thong tin",
  "education_institution": "Dai hoc Bach Khoa",
  "education_level": "Dai hoc",
  "degree_year": 2020,
  "other_it_certificate": "AWS, TOEIC"
}
```

Response `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "idemployee": "NV001",
    "full_name": "Nguyen Van A",
    "email": "a@company.com",
    "status": "ACTIVE"
  },
  "message": "Tạo nhân viên thành công"
}
```

Side effect: API tao employee dong thoi tao user login mac dinh password `123456`.

## 4. Update Employee

`PUT /api/employees/{id}`

Tat ca field deu optional. Chi field nao gui len khac `null` thi moi update.

Request body:

```json
{
  "full_name": "Nguyen Van A Updated",
  "email": "a.updated@company.com",
  "phone": "0912345678",
  "department_id": "department-uuid",
  "position": "Senior Developer",
  "level": "Senior",
  "manager_level_1": "Tran Van B",
  "manager_level_2": "Le Van C",
  "contract_type": "Hop dong lao dong",
  "contract_effective_date": "2026-01-01",
  "contract_expiry_date": "2026-12-31",
  "review_due_date": "2026-03-01",
  "hire_date": "2026-01-01",
  "resignation_date": null,
  "seniority": "1 nam",
  "birth_date": "1998-01-20",
  "gender": "Nam",
  "permanent_address": "Ha Noi",
  "personal_email": "personal@gmail.com",
  "id_number": "001098765432",
  "id_issue_date": "2020-01-01",
  "id_issue_place": "Cuc CSQLHC ve TTXH",
  "emergency_contact_name": "Nguyen Van B",
  "emergency_contact_relationship": "Bo",
  "emergency_contact_phone": "0987654321",
  "programming_language": "Java, React",
  "major": "Cong nghe thong tin",
  "education_institution": "Dai hoc Bach Khoa",
  "education_level": "Dai hoc",
  "degree_year": 2020,
  "other_it_certificate": "AWS, TOEIC",
  "status": "ACTIVE"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "idemployee": "NV001",
    "full_name": "Nguyen Van A Updated",
    "email": "a.updated@company.com",
    "status": "ACTIVE"
  },
  "message": "Cập nhật nhân viên thành công"
}
```

## 5. Resign Employee

`DELETE /api/employees/{id}`

API nay khong xoa ban ghi vat ly. No set:

```json
{
  "status": "RESIGNED"
}
```

Response:

```json
{
  "success": true,
  "message": "Nhân viên đã được resign"
}
```

## Validation And Errors

Create:

| Field | Rule |
|---|---|
| `fullname` | required |
| `idemployee` | required |
| `email` | required, email format, unique |
| `phone` | neu co thi 10-11 chu so |
| `hire_date` | required |
| `department_id` | phai ton tai |
| `personal_email` | neu co thi dung email format |

Update:

| Field | Rule |
|---|---|
| `email` | neu co thi dung format va unique |
| `personal_email` | neu co thi dung email format |

Loi thuong gap:

```json
{
  "success": false,
  "errorCode": 1001,
  "message": "..."
}
```

