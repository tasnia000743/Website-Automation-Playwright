import { DataReaderFactory } from "@/data/DataReaderFactory";
import {test, expect} from "../../fixture/hooks-fixture";

test.describe("API Tests", ()=> {

test("RBA01-Verify that user is able to fetch all the booking ids using GET API an validate the response", async({request})=> {
  const bookingIdsResp= await request.get(process.env.API_BASE_URL!+(await DataReaderFactory.readData("test-data/api-data/api-path-data.json"))[0].booking_path);
  const bookingIdsJSONResp= await bookingIdsResp.json();
  expect(bookingIdsResp.status()).toBe(200);
  expect(bookingIdsResp.statusText()).toBe('OK');
  expect(bookingIdsResp.headers()['content-type']).toContain((await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].content_type)
  expect(bookingIdsJSONResp).not.toBeNull();
});

test.skip("RBA02-Verify that user is able to fetch all the details of specific booking id using GET API an validate the response", async({request})=> {
  const bookingResp= await request.get(process.env.API_BASE_URL!+(await DataReaderFactory.readData("test-data/api-data/api-path-data.json"))[0].booking_path+ "/"+(await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].booking_id);
  const bookingJSONResp= await bookingResp.json();
  console.log(bookingJSONResp)
  expect(bookingResp.status()).toBe(200);
  expect(bookingResp.statusText()).toBe('OK');
  expect(bookingResp.headers()['content-type']).toContain((await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].content_type)
  expect(bookingJSONResp).not.toBeNull();
  expect(bookingJSONResp.firstname).toBe((await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].first_name);

});

test("RBA03-Verify that user is able to create a booking using POST API and validate the response", async({request, common})=> {
  const bookingCreateData= (await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].create_booking_data;
  bookingCreateData.firstname=common.getRandomValue();
  bookingCreateData.lastname= common.getRandomValue();

  const createBookingResp= await request.post(process.env.API_BASE_URL!+(await DataReaderFactory.readData("test-data/api-data/api-path-data.json"))[0].booking_path, {
    headers: {
      "content-Type": (await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].content_type
    },
    data: bookingCreateData
  });
  const createBookingJSONResp= await createBookingResp.json();
  expect(createBookingResp.status()).toBe(200);
  expect(createBookingResp.statusText()).toBe('OK');
  expect(createBookingResp.headers()['content-type']).toContain((await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].content_type)
  expect(createBookingJSONResp).not.toBeNull();
  expect(createBookingJSONResp.booking).toEqual(bookingCreateData);

});

test("RBA04-AVerify that user is able to update an existing booking with PUT API and validate the response", async({request, common, commonAPI})=> {
  const bookingUpdateData= (await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].update_booking_data;
  bookingUpdateData.firstname=common.getRandomValue();
  bookingUpdateData.lastname= common.getRandomValue();
   const token=await commonAPI.getApiToken();
  const updateBookingResp= await request.put(process.env.API_BASE_URL!+(await DataReaderFactory.readData("test-data/api-data/api-path-data.json"))[0].booking_path + "/"+ (await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].booking_id2, {
    
    headers: {
      Cookie: `token=${token}`
    },
    data: bookingUpdateData
  });
  const updateBookingJSONResp= await updateBookingResp.json();
  expect(updateBookingResp.status()).toBe(200);
  expect(updateBookingResp.statusText()).toBe('OK');
  expect(updateBookingResp.headers()['content-type']).toContain((await DataReaderFactory.readData("test-data/api-data/restful-book-api-module-data.json"))[0].content_type)
  expect(updateBookingJSONResp).not.toBeNull();
  expect(updateBookingJSONResp).toEqual(bookingUpdateData);

});


});


