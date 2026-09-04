$base = "http://localhost:5000"

$patients = @(
  @{ idNum = 1; name = "Test Patient 01"; phone = "+91 91000 00001"; email = "anasahmedkhan4535@gmail.com"; existingCount = 3 },
  @{ idNum = 2; name = "Test Patient 02"; phone = "+91 91000 00002"; email = "anasahmedkhan845@gmail.com"; existingCount = 0 },
  @{ idNum = 3; name = "Test Patient 03"; phone = "+91 91000 00003"; email = "ahmedkhanans57@gmail.com"; existingCount = 0 },
  @{ idNum = 4; name = "Test Patient 04"; phone = "+91 91000 00004"; email = "imoo12333@gmail.com"; existingCount = 0 },
  @{ idNum = 5; name = "Test Patient 05"; phone = "+91 91000 00005"; email = "daaraynorg@gmail.com"; existingCount = 0 }
)

$slotSchedule = @(
  @{ date = "2026-09-06"; time = "10:00 AM" },
  @{ date = "2026-09-06"; time = "11:30 AM" },
  @{ date = "2026-09-07"; time = "10:00 AM" },
  @{ date = "2026-09-07"; time = "02:00 PM" },
  @{ date = "2026-09-08"; time = "11:30 AM" },
  @{ date = "2026-09-08"; time = "03:30 PM" }
)

Write-Host "===================================="
Write-Host "PHASE 2 & 3: 30 PUBLIC BOOKINGS"
Write-Host "===================================="

foreach ($p in $patients) {
  $needed = 6 - $p.existingCount
  for ($i = 0; $i -lt $needed; $i++) {
    $idx = ($p.existingCount + $i) % $slotSchedule.Count
    $slot = $slotSchedule[$idx]
    $bookingNum = $p.existingCount + $i + 1
    
    $body = @{
      patientData = @{
        name = $p.name
        phone = $p.phone
        email = $p.email
        symptomDuration = "3-6 months"
      }
      date = $slot.date
      time = $slot.time
      service = "Chiropractic Care"
      notes = "Public Booking #$bookingNum for $($p.name)"
      idempotencyKey = "public_qa_$($p.idNum)_$($bookingNum)_$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())"
    } | ConvertTo-Json -Depth 5

    try {
      $resp = Invoke-RestMethod -Uri "$base/api/public/book" -Method POST -ContentType "application/json" -Body $body
      Write-Host "Public $($p.name) [$bookingNum/6]: SUCCESS | Appt: $($resp.appointment.id) | Token: $($resp.patient.registrationTokenNumber)"
    } catch {
      Write-Host "Public $($p.name) [$bookingNum/6]: FAILED | $($_.Exception.Message)"
    }
    Start-Sleep -Milliseconds 600
  }
}

Write-Host "`n===================================="
Write-Host "PHASE 6: 30 ADMIN DIRECT BOOKINGS"
Write-Host "===================================="

$adminSlotSchedule = @(
  @{ date = "2026-09-09"; time = "10:00 AM" },
  @{ date = "2026-09-09"; time = "02:00 PM" },
  @{ date = "2026-09-10"; time = "11:30 AM" },
  @{ date = "2026-09-10"; time = "03:30 PM" },
  @{ date = "2026-09-11"; time = "10:00 AM" },
  @{ date = "2026-09-11"; time = "02:00 PM" }
)

$headers = @{
  "Authorization" = "Bearer admin_master_token"
  "x-admin-user-email" = "admin@holisticedge.in"
}

foreach ($p in $patients) {
  for ($i = 0; $i -lt 6; $i++) {
    $idx = $i % $adminSlotSchedule.Count
    $slot = $adminSlotSchedule[$idx]
    $bookingNum = $i + 1
    
    $body = @{
      fullName = $p.name
      phone = $p.phone
      email = $p.email
      service = "Chiropractic Care"
      condition = "Lower Back Pain"
      preferredDate = $slot.date
      preferredTime = $slot.time
      status = "CONFIRMED"
      source = "ADMIN_DIRECT"
      notes = "Admin Direct Booking #$bookingNum for $($p.name)"
    } | ConvertTo-Json -Depth 5

    try {
      $resp = Invoke-RestMethod -Uri "$base/api/appointments" -Method POST -Headers $headers -ContentType "application/json" -Body $body
      $tok = if ($resp.appointment.registrationTokenNumber) { $resp.appointment.registrationTokenNumber } else { $resp.patient.registrationTokenNumber }
      Write-Host "Admin $($p.name) [$bookingNum/6]: SUCCESS | Appt: $($resp.appointment.id) | Token: $tok"
    } catch {
      Write-Host "Admin $($p.name) [$bookingNum/6]: FAILED | $($_.Exception.Message)"
    }
    Start-Sleep -Milliseconds 600
  }
}
Write-Host "`n===================================="
Write-Host "BATCH TRANSACTIONS FINISHED!"
Write-Host "===================================="
