import {notifyConfig} from '@/utils/'
import {queryInvoice, queryCollect} from '@/api/database'
import {getWhether} from '@/api/constant'

export default {
	name: 'collect',
	data () {
		return {
			queryData: {
				page: 1,
        limit: 10,
				name: '',
        invoice: '0',
				isEnabled: '0'
			},
			rules: {
				name: [
					{required: true, message: '请输入汇总项目名称', trigger: 'blur'}
				]
			},
			tableData: [],  //  表格数据
      invoiceOption: [],  // 下拉 发票项目
      invoiceOptSel: [],  // 查询下拉 发票项目
      whetherOption: [],  // 查询下拉 是否启用
			formTemp: null, // 表单渲染值
      indexTemp: null,  //  表单渲染值对应序号
      visibleList: true,  // 列表是否可见
      statusForm: 'create' //  'update' or 'create'
		}
	},
	created () {
  	this.getList()
  },
	computed: {
  	total () { // 记录总数
      return this.tableData.length
    },
    tablePageData () { // 表格分页
      return this.tableData.slice(this.queryData.limit * (this.queryData.page - 1), this.queryData.page * this.queryData.limit)
    }
  },
	methods: {
		/* 格式化 */
    formatterInvoice (item) { // 发票项目
      let valArr = []
      valArr = this.invoiceOption.filter(val => {
        return val.code === item.invoice
      })
      return valArr.length ? valArr[0].name : ''
    },
  	formatterEnabled (item) { // 是否易用
      let valArr = []
      valArr = this.whetherOption.filter(val => {
        return val.code === item.isenabled
      })
      return valArr.length ? valArr[0].name : ''
    },
		/* 筛选 */
  	indexMethod (index) { // 表格序号
      return this.queryData.limit * (this.queryData.page - 1) + 1 + index
    },
    /* 动画 */
    enter (el, done) {
      if (this.$refs['formEdit']) {
        this.$refs['formEdit'].clearValidate()
        this.$store.dispatch('set_bread_name', '编辑业务类型')
      } else {
        this.$store.dispatch('set_bread_name', '')
      }
    },
  	/* 交互方法 */
		clickQuery () {
			console.log('业务类型查询')
		},
		getList () {
      // 常量查询 发票项目
      queryInvoice().then(response => {
        this.invoiceOption = response.data
        this.invoiceOptSel = JSON.parse(JSON.stringify(this.invoiceOption))
        this.invoiceOptSel.unshift({code: '0', name: '不限'})
      })
      // 常量查询 是否
      getWhether().then(response => {
        this.whetherOption = response.data
        this.whetherOption.unshift({code: '0', name: '不限'})
      })
      // 查询发票项目
      queryCollect().then(response => {
        this.tableData = response.data
      })
    },
    handleSizeChange (val) { // 每页条数改变
      this.queryData.limit = val
    },
    handleCurrentChange (val) { // 当前页数改变
      this.queryData.page = val
    },
    resetFormTemp () {
      this.formTemp = {
        name: '',
        code: '',
        isenabled: '1',
        lastaccount: '',
        lasttime: ''
      }
    },
    clickCreate () { // 新增交互
      this.statusForm = 'create'
      this.resetFormTemp()
      this.visibleList = false
    },
    createData () {
      this.$refs['formEdit'].validate((valid) => {
        if (valid) {
          console.log(this.formTemp)
          this.tableData.unshift(this.formTemp)
          this.visibleList = true
          this.$notify(notifyConfig('新增', 'success'))
        } else {
          console.log('校验不通过')
          return false
        }
      })
    },
    clickUpdate (row, index) { // 编辑交互
      this.statusForm = 'update'
      this.indexTemp = index
      this.formTemp = Object.assign({}, row)
      this.visibleList = false
    },
    updateData () {
      this.$refs['formEdit'].validate((valid) => {
        if (valid) {
          console.log(this.formTemp)
          let tbIndex = this.indexMethod(this.indexTemp) - 1
          this.tableData.splice(tbIndex, 1, this.formTemp)
          this.visibleList = true
          this.$notify(notifyConfig('更新', 'success'))
        } else {
          console.log('校验不通过')
          return false
        }
      })
    },
    deleteData (index) {
      this.$confirm('你确定退出要删除记录吗?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let tbIndex = this.indexMethod(index) - 1
        this.tableData.splice(tbIndex, 1)
        this.$notify(notifyConfig('删除', 'success'))
      }).catch(() => {})
    }
	}
}
