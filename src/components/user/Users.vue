<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                            <el-button type="info" icon="el-icon-setting" size="mini" circle></el-button>
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="showSetRole(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
          <!-- 分页区域 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10, 15]"
          :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
          :pager-count="5" :total="total">
          </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户信息"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
            >
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" status-icon>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
            >
            <!-- 内容主体区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" status-icon>
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
            <div>
                <p>当前用户：{{userInfo.username}}</p>
                <p>当前角色：{{userInfo.role_name}}</p>
                <p>
                分配角色：
                <el-select
                    v-model="selectRoleId"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择文章标签"
                >
                    <el-option
                    v-for="item in rolesLsit"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id"
                    ></el-option>
                </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        // 添加用户邮箱验证
        const checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('Please enter valid email!'))
        }
        // 添加用户手机验证
        const checkMobile = (rule, value, cb) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('Please enter valid mobile!'))
        }
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页显示数据数目
                pagesize: 5
            },
            userlist: [],
            total: 0,
            // 添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户表单的验证规则
            addFormRules: {
                username: [
                    { required: true, message: 'Please enter your username', trigger: 'blur' },
                    { min: 3, max: 10, message: 'The length of username is from 3 to 10 characters', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please enter your password', trigger: 'blur' },
                    { min: 6, max: 15, message: 'The length of password is from 6 to 15 characters', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'Please enter your email', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: 'Please enter your mobile', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 查询到的用户信息对象
            editForm: {},
            // 编辑用户的表单验证规则
            editFormRules: {
                email: [
                    { required: true, message: 'Please enter your email', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: 'Please enter your mobile', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 分配角色对话框
            setRoleDialogVisible: false,
            // 当前需要被分配角色的用户
            userInfo: {},
            // 所有角色数据列表
            rolesLsit: [],
            // 已选中的角色Id值
            selectRoleId: ''
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            const { data: res } = await this.$http.get('users', {
                params: this.queryInfo
            });
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
            this.userlist = res.data.users
            this.total = res.data.total
            // console.log('userinfo: ', res)
        },
        // 监听pageSize(每页显示数目）改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听 switch 状态的改变
        async userStateChange (userinfo) {
            // console.log(userinfo)
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state // 状态更新失败 改回去
                return this.$message.error('用户状态更新失败!')
            }
            this.$message.success('用户状态更新成功!')
        },
        // 监听添加用户对话框关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 调用 API 添加用户
        addUser() {
            this.$refs.addFormRef.validate(async (valid, obj) => {
                if (valid) {
                    // console.log(valid) // true 全部字段校验通过
                    const { data: res } = await this.$http.post('users', this.addForm)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加用户失败!')
                    }
                    this.$message.success('添加用户成功!')
                    // 关闭对话框
                    this.addDialogVisible = false
                    // 重新获取用户列表
                    this.getUserList()
                } else {
                    console.log(obj + 'is invalid!')
                }
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            // console.log(id)
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听修改用户对话框关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 校验通过，发起修改用户信息请求
                const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败!')
                }
                this.editDialogVisible = false
                this.getUserList()
                this.$message.success('更新用户信息成功!')
            })
        },
        // 根据ID删除用户
        async removeUserById(id) {
            // console.log(id)
            const confirmReuslt = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).catch(err => err)
            // 若确定则返回字符串 confirm 取消则 cancel
            // console.log(confirmReuslt)
            if (confirmReuslt !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            // console.log('确认删除')
            const { data: res } = await this.$http.delete('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败!')
            }
            this.$message.success('删除用户成功!')
            this.getUserList()
        },
        // 展示分配角色的对话框
        async showSetRole (role) {
            this.userInfo = role
            // 展示对话框之前，获取所有角色列表
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            this.rolesLsit = res.data
            this.setRoleDialogVisible = true
        },
        // 分配角色
        async saveRoleInfo () {
            if (!this.selectRoleId) {
                return this.$message.error('请选择要分配的角色')
            }
            const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
            // console.log('role: ', res) // 分配用户角色接口被做了处理 返回400 （换API）
            if (res.meta.status !== 200) {
                return this.$message.error('更新用户角色失败！')
            }
            this.$message.success('更新角色成功！')
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        // 分配角色对话框关闭事件
        setRoleDialogClosed () {
            this.selectRoleId = ''
            this.userInfo = {}
        }
    }
}
</script>

<style lang="less" scoped>
</style>
