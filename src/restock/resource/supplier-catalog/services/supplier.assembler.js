export class SupplierAssembler {
    static toSupplierEntity({ user, profile, role, categories }) {
        return {
            id: user.id,
            email: user.email,
            name: profile?.name || '',
            address: profile?.business_address || profile?.address || '-',
            avatar: profile?.avatar || '',
            phone: profile?.phone || '',
            contactPerson: profile?.name || '',
            position: profile?.description || '',
            categories: categories.map(c => c.name), // <-- array para las categories
            status: true,
            added: false
        }
    }
}