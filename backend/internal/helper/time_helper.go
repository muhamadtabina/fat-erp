package helper

import (
	"time"
)

// FormatTimeIndonesia formats time to Indonesian format
// Example: "Senin, 21 Juli 2025 15:04:05 WIB"
func FormatTimeIndonesia(t time.Time) string {
	location, err := time.LoadLocation("Asia/Jakarta")
	if err != nil {
		location = time.UTC
	}
	t = t.In(location)

	days := map[string]string{
		"Sunday":    "Minggu",
		"Monday":    "Senin",
		"Tuesday":   "Selasa",
		"Wednesday": "Rabu",
		"Thursday":  "Kamis",
		"Friday":    "Jumat",
		"Saturday":  "Sabtu",
	}

	months := map[string]string{
		"January":   "Januari",
		"February":  "Februari",
		"March":     "Maret",
		"April":     "April",
		"May":       "Mei",
		"June":      "Juni",
		"July":      "Juli",
		"August":    "Agustus",
		"September": "September",
		"October":   "Oktober",
		"November":  "November",
		"December":  "Desember",
	}

	dayName := days[t.Format("Monday")]
	monthName := months[t.Format("January")]

	return dayName + ", " + t.Format("02") + " " + monthName + " " + t.Format("2006")
}
