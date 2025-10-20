
export interface UserDetailService {
    createUserDetail(request: AuthRegisterRequest, userId: number);
    findById(id: number);
    findAll();
    updateUser(request: any);
    deleteUserById(id: number);
}
