import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShareTimeService } from '../../share-time/share-time.service';

@Component({
  selector: 'app-delete-diary-entry',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './delete-diary-entry.component.html',
  styleUrl: './delete-diary-entry.component.scss'
})
export class DeleteDiaryEntryComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shareTimeService: ShareTimeService,
    public dialogRef: MatDialogRef<DeleteDiaryEntryComponent>,
  ) {
  }

  deleteEntry() {
    const diaryEntries = this.data.diaryEntries;
    const entryIndex = this.data.entryIndex;
    diaryEntries.splice(entryIndex, 1);
    this.data.save();
    this.dialogRef.close();
  }
}
