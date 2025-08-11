/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'dexie';
import { PersonStorage } from '@/types/people';
import { Person } from '@/types/people';

export class PeopleRepository {
  constructor(private people: Table<PersonStorage>) {}

  async save(person: PersonStorage): Promise<void> {
    console.log('PeopleRepository - save called with:', person);
    await this.people.put(person);
    console.log('PeopleRepository - save completed successfully');
  }

  async getById(id: string): Promise<PersonStorage | null> {
    const person = await this.people.get(id);
    return person || null;
  }

  async getByUserId(userId: string): Promise<PersonStorage[]> {
    console.log('PeopleRepository - getByUserId called for userId:', userId);
    const people = await this.people
      .where("userId")
      .equals(userId)
      .toArray();
    
    console.log('PeopleRepository - getByUserId raw results:', people);

    // Sort by updatedAt in descending order, with default person first
    const sortedPeople = people.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    console.log('PeopleRepository - getByUserId sorted results:', sortedPeople);
    return sortedPeople;
  }

  async getDefault(userId: string): Promise<PersonStorage | null> {
    const person = await this.people
      .where("userId")
      .equals(userId)
      .and(p => p.isDefault === true)
      .first();
    return person || null;
  }

  async setDefault(userId: string, personId: string): Promise<void> {
    console.log('PeopleRepository - setDefault called:', { userId, personId });
    
    // First, remove default flag from all user's people
    const userPeople = await this.getByUserId(userId);
    console.log('PeopleRepository - setDefault userPeople:', userPeople);
    
    const updatePromises = userPeople.map(person => 
      this.people.update(person.id, { isDefault: false })
    );
    await Promise.all(updatePromises);
    console.log('PeopleRepository - setDefault cleared all defaults');

    // Then set the new default
    await this.people.update(personId, { isDefault: true });
    console.log('PeopleRepository - setDefault set new default:', personId);
  }

  async delete(personId: string): Promise<void> {
    await this.people.delete(personId);
  }

  // Transformation utilities
  toPerson(storage: PersonStorage): Person {
    return {
      id: storage.id,
      userId: storage.userId,
      name: storage.name,
      relationship: storage.relationship,
      birthData: {
        dateOfBirth: storage.dateOfBirth,
        timeOfBirth: storage.timeOfBirth,
        locationOfBirth: storage.locationOfBirth,
        coordinates: storage.coordinates
      },
      notes: storage.notes,
      createdAt: new Date(storage.createdAt),
      updatedAt: new Date(storage.updatedAt),
      isDefault: storage.isDefault
    };
  }

  fromPerson(person: Person): PersonStorage {
    return {
      id: person.id,
      userId: person.userId,
      name: person.name,
      relationship: person.relationship,
      dateOfBirth: person.birthData.dateOfBirth,
      timeOfBirth: person.birthData.timeOfBirth,
      locationOfBirth: person.birthData.locationOfBirth,
      coordinates: person.birthData.coordinates,
      notes: person.notes,
      createdAt: person.createdAt.toISOString(),
      updatedAt: person.updatedAt.toISOString(),
      isDefault: person.isDefault
    };
  }
}