import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, map, throwError, timeout } from 'rxjs';
import { omit } from 'lodash';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  private readonly logger = new Logger(ReservationsService.name);

  // create(createReservationDto: CreateReservationDto, userId: string) {
  //   this.paymentsService
  //     .send('create_charge', createReservationDto.charge)
  //     .pipe(
  //       // map(() => {
  //       //   return this.reservationsRepository.create({
  //       //     ...createReservationDto,
  //       //     timestamp: new Date(),
  //       //     userId,
  //       //   });
  //       // }),
  //       timeout(10_000),
  //       catchError((err) => {
  //         // err может быть из RpcException
  //         const msg = err?.message || err?.message?.message || 'Payment failed';
  //         const status = err?.status || err?.error?.status;
  //         return throwError(() =>
  //           status && status < 500
  //             ? new BadRequestException(msg)
  //             : new InternalServerErrorException(msg),
  //         );
  //       }),
  //     );
  // }

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    try {
      const charge = await firstValueFrom(
        this.paymentsService
          .send('create_charge', {
            ...createReservationDto.charge,
            email,
          })
          .pipe(
            timeout(10_000),
            catchError((err) => {
              // сюда прилетает RpcException из микросервиса
              const msg = err?.message || err?.message?.message || 'Payment failed';
              const status = err?.status || err?.error?.status;
              return throwError(() =>
                status && status < 500
                  ? new BadRequestException(msg)
                  : new InternalServerErrorException(msg),
              );
            }),
          ),
      );

      const toCreate = {
        ...omit(createReservationDto, ['charge']),
        invoiceId: String(charge?.id ?? ''),
        timestamp: new Date(),
        userId,
      };

      this.logger.debug(`Creating reservation: ${JSON.stringify(toCreate)}`);

      const doc = await this.reservationsRepository.create(toCreate);
      return (doc as any).toObject?.() ?? doc;
    } catch (e: any) {
      // Единая обработка ошибок (и платежа, и БД)
      this.logger.error(`Failed to create reservation`, e?.stack || e);

      if (e?.code === 11000) {
        throw new ConflictException('Duplicate key: ' + JSON.stringify(e?.keyValue));
      }
      if (
        e?.name === 'ValidationError' ||
        e?.name === 'CastError' ||
        e?.name === 'StrictModeError' ||
        /validation|cast|strict|unknown|required/i.test(e?.message)
      ) {
        throw new BadRequestException(e?.message || 'Validation error');
      }
      // если это уже HttpException из catchError выше — просто пробросится
      if (e?.status && e?.response) throw e;

      throw new InternalServerErrorException('Unable to create reservation');
    }
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
