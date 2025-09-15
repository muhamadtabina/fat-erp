package dto

import "reflect"

type PaginationRequest struct {
	Page  int `json:"page" query:"page"`
	Limit int `json:"limit" query:"limit"`
}

type PaginationResponse struct {
	CurrentPage int         `json:"current_page"`
	Limit       int         `json:"limit"`
	TotalItems  int64       `json:"total_items"`
	TotalPages  int         `json:"total_pages"`
	HasNext     bool        `json:"has_next"`
	HasPrevious bool        `json:"has_previous"`
	Data        interface{} `json:"data"`
}

func NewPaginationResponse(currentPage, limit int, totalItems int64, data interface{}) PaginationResponse {
	var totalPages int
	if limit > 0 { // Menghindari pembagian dengan nol
		totalPages = int(totalItems) / limit
		if int(totalItems)%limit > 0 {
			totalPages++
		}
	}

	// Gunakan reflection untuk memeriksa slice yang nil atau kosong
	val := reflect.ValueOf(data)
	if val.Kind() == reflect.Slice {
		if val.IsNil() || val.Len() == 0 {
			// Ganti dengan slice kosong agar JSON outputnya "[]" bukan "null"
			data = make([]interface{}, 0)
		}
	}

	return PaginationResponse{
		CurrentPage: currentPage,
		Limit:       limit,
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		HasNext:     currentPage < totalPages,
		HasPrevious: currentPage > 1,
		Data:        data,
	}
}
