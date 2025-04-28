interface Location {
  latitude: number;
  longitude: number;
  address: string;
}
export class Memory {
  id: string;
  title: string;
  imageUri: string;
  address: string;
  location: { latitude: number; longitude: number };

  constructor(title: string, imageUri: string, location: Location, id: string) {
    this.title = title;
    this.imageUri = imageUri;
    this.address = location.address;
    this.location = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    this.id = id;
  }
}
