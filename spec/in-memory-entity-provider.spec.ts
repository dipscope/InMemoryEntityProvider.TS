import { EntitySet, EntityStore } from '@dipscope/entity-store';
import { Inject, Property, Type } from '@dipscope/type-manager';
import { InMemoryEntityProvider } from '../src';

@Type()
class User
{
    @Property(String) public name: string;

    public constructor(@Inject('name') name: string)
    {
        this.name = name;

        return;
    }
}

@Type({
    injectable: true
})
class SpecEntityStore extends EntityStore
{
    public readonly userSet: EntitySet<User>;

    public constructor()
    {
        super(new InMemoryEntityProvider());

        this.userSet = this.createEntitySet(User);

        return;
    }
}

describe('Entity set', () =>
{
    it('should add new entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const user = new User('Dmitry');
        const addedUser = await userSet.add(user);
        const foundUser = await userSet.filter((u, fe) => fe.eq(u.name, 'Dmitry')).findOne();

        expect(addedUser).not.toBeNull();
        expect(foundUser).not.toBeNull();
    });

    it('should update existing entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const user = new User('Dmitry');
        const addedUser = await userSet.add(user);

        expect(addedUser).not.toBeNull();

        user.name = 'Alex';

        const updatedUser = await userSet.update(user);
        const foundUser = await userSet.filter((u, fe) => fe.eq(u.name, 'Alex')).findOne();

        expect(updatedUser).not.toBeNull();
        expect(foundUser).not.toBeNull();
    });

    it('should save new entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const user = new User('Dmitry');
        const addedUser = await userSet.save(user);
        const foundAddedUser = await userSet.filter((u, fe) => fe.eq(u.name, 'Dmitry')).findOne();

        expect(addedUser).not.toBeNull();
        expect(foundAddedUser).not.toBeNull();

        user.name = 'Alex';

        const updatedUser = await userSet.save(user);
        const foundUpdatedUser = await userSet.filter((u, fe) => fe.eq(u.name, 'Alex')).findOne();

        expect(updatedUser).not.toBeNull();
        expect(foundUpdatedUser).not.toBeNull();
    });

    it('should remove existing entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const user = new User('Dmitry');
        const addedUser = await userSet.add(user);

        expect(addedUser).not.toBeNull();

        const removedUser = await userSet.remove(user);
        const foundUser = await userSet.filter((u, fe) => fe.eq(u.name, 'Dmitry')).findOne();

        expect(removedUser).not.toBeNull();
        expect(foundUser).toBeNull();
    });

    it('should bulk add new entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const addedUsers = await userSet.bulkAdd([userX, userY]);
        const foundUsers = await userSet.filter((u, fe) => fe.in(u.name, ['Dmitry', 'Alex'])).findAll();

        expect(addedUsers.length).toBe(2);
        expect(foundUsers.length).toBe(2);
    });

    it('should bulk update existing entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const addedUsers = await userSet.bulkAdd([userX, userY]);

        expect(addedUsers.length).toBe(2);

        userX.name = 'Victor';
        userY.name = 'Roman';

        const updatedUsers = await userSet.bulkUpdate([userX, userY]);
        const foundUsers = await userSet.filter((u, fe) => fe.in(u.name, ['Victor', 'Roman'])).findAll();

        expect(updatedUsers.length).toBe(2);
        expect(foundUsers.length).toBe(2);
    });

    it('should bulk save new entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const addedUsers = await userSet.bulkSave([userX, userY]);
        const foundAddedUsers = await userSet.filter((u, fe) => fe.in(u.name, ['Dmitry', 'Alex'])).findAll();

        expect(addedUsers.length).toBe(2);
        expect(foundAddedUsers.length).toBe(2);

        userX.name = 'Victor';
        userY.name = 'Roman';

        const updatedUsers = await userSet.bulkUpdate([userX, userY]);
        const foundUpdatedUsers = await userSet.filter((u, fe) => fe.in(u.name, ['Victor', 'Roman'])).findAll();

        expect(updatedUsers.length).toBe(2);
        expect(foundUpdatedUsers.length).toBe(2);
    });

    it('should batch update existing entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const addedUsers = await userSet.bulkAdd([userX, userY]);

        expect(addedUsers.length).toBe(2);

        await userSet.filter((u, fe) => fe.in(u.name, ['Dmitry', 'Alex'])).update({ name: 'Victor' });

        const updatedUsers = await userSet.filter((u, fe) => fe.eq(u.name, 'Victor')).findAll();

        expect(updatedUsers.length).toBe(2);
    });

    it('should bulk remove existing entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const addedUsers = await userSet.bulkAdd([userX, userY]);

        expect(addedUsers.length).toBe(2);

        const removedUsers = await userSet.bulkRemove([userX, userY]);
        const foundUsers = await userSet.filter((u, fe) => fe.in(u.name, ['Dmitry', 'Alex'])).findAll();

        expect(removedUsers.length).toBe(2);
        expect(foundUsers.length).toBe(0);
    });

    it('should batch remove existing entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const addedUsers = await userSet.bulkAdd([userX, userY]);

        expect(addedUsers.length).toBe(2);

        await userSet.filter((u, fe) => fe.in(u.name, ['Dmitry', 'Alex'])).remove();

        const foundUsers = await userSet.filter((u, fe) => fe.in(u.name, ['Dmitry', 'Alex'])).findAll();

        expect(foundUsers.length).toBe(0);
    });

    it('should sort existing entities in ascending order', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const addedUsers = await userSet.bulkAdd([userX, userY]);

        expect(addedUsers.length).toBe(2);

        const sortedUsers = await userSet.sortByAsc(e => e.name).findAll();

        expect(sortedUsers.at(0)?.name).toBe('Alex');
        expect(sortedUsers.at(1)?.name).toBe('Dmitry');
    });

    it('should sort existing entities in descending order', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const addedUsers = await userSet.bulkAdd([userX, userY]);

        expect(addedUsers.length).toBe(2);

        const sortedUsers = await userSet.sortByDesc(e => e.name).findAll();

        expect(sortedUsers.at(0)?.name).toBe('Dmitry');
        expect(sortedUsers.at(1)?.name).toBe('Alex');
    });

    it('should filter existing entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const userZ = new User('Victor');
        const addedUsers = await userSet.bulkAdd([userX, userY, userZ]);

        expect(addedUsers.length).toBe(3);

        const filteredUsers = await userSet.filter((u, fe) => fe.eq(u.name, 'Alex')).findAll();

        expect(filteredUsers.length).toBe(1);
        expect(filteredUsers.first()).toBe(userY);
    });

    it('should paginate existing entities', async () =>
    {
        const specEntityStore = new SpecEntityStore();
        const userSet = specEntityStore.userSet;
        const userX = new User('Dmitry');
        const userY = new User('Alex');
        const userZ = new User('Victor');
        const addedUsers = await userSet.bulkAdd([userX, userY, userZ]);

        expect(addedUsers.length).toBe(3);

        const paginatedUsers = await userSet.paginate(p => p.limit(2)).findAll();

        expect(paginatedUsers.totalLength).toBe(3);
        expect(paginatedUsers.length).toBe(2);
        expect(paginatedUsers.at(0)).toBe(userX);
        expect(paginatedUsers.at(1)).toBe(userY);
        expect(paginatedUsers.hasNextPage()).toBeTrue();
        expect(paginatedUsers.hasPrevPage()).toBeFalse();

        const nextPaginatedUsers = await paginatedUsers.nextPage();

        expect(nextPaginatedUsers.totalLength).toBe(3);
        expect(nextPaginatedUsers.length).toBe(1);
        expect(nextPaginatedUsers.at(0)).toBe(userZ);
        expect(nextPaginatedUsers.hasNextPage()).toBeFalse();
        expect(nextPaginatedUsers.hasPrevPage()).toBeTrue();
    });
});
