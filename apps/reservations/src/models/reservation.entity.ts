import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common/database/abstract.entity';

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
  @Column({ type: 'timestamp', nullable: false })
  timestamp?: Date;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  placeId?: string;

  @Column({ type: 'varchar', length: 255 })
  invoiceId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  paymentId?: string | null;
}
