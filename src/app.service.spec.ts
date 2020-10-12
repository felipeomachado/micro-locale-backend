import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';


const validLocale = {
  _id: '5f822543ad9cab1c444bcae5',
  cityId: 2111300,
  cityName: 'SAO LUIS',
  state: 'MA'
}


describe('LocalesService', () => {
  let service: AppService;
  const mockModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn()    
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken('Locale'),
          useValue: mockModel
        }
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  beforeEach(() => {
    mockModel.findOne.mockReset();
    mockModel.create.mockReset();
    mockModel.save.mockReset();
    mockModel.find.mockReset();
    mockModel.findById.mockReset();
    mockModel.findByIdAndUpdate.mockReset();

  });
  
  describe('When search all Locales', () => {
    it('should be list all locales', async () => {

      mockModel.find.mockReturnValue([validLocale, validLocale]);
      
      const localesFound = await service.findAllLocales();

      expect(localesFound).toHaveLength(2);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
      
    });
  })

  describe('When search Locale by Id', () => {
    it('should be find a existing locale', async () => {
    
      mockModel.findById.mockReturnValue(validLocale);

      const localeFound = await service.findLocaleByIdOrThrow(validLocale._id);
  
      expect(localeFound).toMatchObject(validLocale);
      expect(mockModel.findById).toHaveBeenCalledTimes(1);
    });
  })

  describe('When update Locale', () => {
    it('should update a locale', async () => {

      const localeUpdated = {
        cityId: 2111300,
        cityName: 'TERESINA',
        state: 'PI'
      };
     
      mockModel.findByIdAndUpdate.mockReturnValue({
        ...validLocale,
        ...localeUpdated
      });

      await service.updateLocale(validLocale._id, localeUpdated);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    
  })

  

  
});
