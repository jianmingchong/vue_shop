<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                     <el-input placeholder="请输入内容">
                         <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send">
                    <template slot-scope="scope">
                        <template>{{ scope.row.is_send }}</template>
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dataFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <!-- 修改地址对话框 -->
            <el-dialog
                title="修改地址"
                :visible.sync="addressVisible"
                width="50%"
                @close="addressDialogClosed">
                <el-form ref="addressFormRef" :rules="addressFormRules" :model="addressForm" label-width="100px">
                    <el-form-item label="省市县/区" prop="address1">
                        <el-cascader :options="citeDate" v-model="addressForm.address1"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 展示物流对话框 -->
            <el-dialog
                title="物流进度"
                :visible.sync="progressVisible"
                width="50%">
                <el-timeline>
                    <el-timeline-item
                    v-for="(activity, index) in progressInfo"
                    :key="index"
                    :timestamp="activity.time">
                    {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="progressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="progressVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>

import citeDate from './citydata.js'
export default {
    name: 'Order',
    data () {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            orderlist: [],
            addressVisible: false,
            addressForm: {
                address1: '',
                address2: ''
            },
            addressFormRules: {
                address1: [
                    { required: true, message: '请选择省市县区', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ]
            },
            citeDate,
            progressVisible: false,
            progressInfo: []
        }
    },
    created () {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
            if (res.meta.status !== 200) {
                return this.$message.error('获取订单列表失败！')
            }
            // console.log(res)
            this.total = res.data.total
            this.orderlist = res.data.goods
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        showBox() {
            this.addressVisible = true
        },
        addressDialogClosed() {
            this.$refs.addressFormRef.resetFields()
        },
        async showProgressBox() {
            const { data: res } = await this.$http.get('/kuaidi/1106975712662')
            // 1106975712662 测试订单号
            if (res.meta.status !== 200) {
                return this.$message.error('获取物流信息失败！')
            }
            this.progressInfo = res.data
            this.progressVisible = true
            // console.log(this.progressInfo)
        }
    }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>
