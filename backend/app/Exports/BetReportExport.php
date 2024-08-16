<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class BetReportExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize, WithChunkReading
{
     /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->bet;
    }
    public function __construct($bet)
    {
        $this->bet = $bet;
    }
    public function chunkSize(): int
    {
        return 1000; // Adjust this based on your needs
    }
    public function headings(): array
    {
        return [
            [
                'Bet Id',
                'User Id', 
                'Organization',
                'Subscriber',
                'Auto Rate',
                'Escape Rate',
                'Bet Amount',
                'Win Amount',
                'Result',
                'Currency',
                'Created_at',
            ],
        ];
    }
    public function map($bet): array
    {
        return [
            $bet->id,
            $bet->user_id,
            $bet->organization_name,
            $bet->subscriber_name,
            $bet->auto_rate,
            $bet->escape_rate,
            $bet->bet_amount,
            $bet->winning_amount,
            $bet->result,
            $bet->currency_code,
            $bet->created_at,
            
        ];
    }
    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => false]],

        ];
    }
    // public function columnWidths(): array
    // {
    //     return [
    //         'I' => 50,          
    //     ];
    // }
}
