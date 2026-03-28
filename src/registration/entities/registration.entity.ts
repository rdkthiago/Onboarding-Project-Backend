import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegistrationStep } from './registration-step.enum';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  document: string; 

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zipCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complement: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  neighborhood: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  state: string;

  @Column({
    type: 'enum',
    enum: RegistrationStep,
    default: RegistrationStep.IDENTIFICATION,
  })
  currentStep: RegistrationStep;

  @CreateDateColumn()
  startedAt: Date; 

  @UpdateDateColumn()
  lastUpdatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date;
}