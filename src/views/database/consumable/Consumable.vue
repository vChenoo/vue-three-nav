<template>
	<div class="consumable">
		<transition name="fade" mode="out-in" v-on:enter="enter">
			<div key="list" class="page-show" v-if="visibleList">
				<content-title>耗材管理</content-title>
			  <el-form :inline="true" :model="queryData" size="small">
			  	<el-form-item label="耗材名称">
			      <el-input v-model="queryData.name" placeholder="耗材名称"></el-input>
			    </el-form-item>
			    <el-form-item label="是否启用">
			      <el-select v-model="queryData.isEnabled" placeholder="是否启用">
			        <el-option v-for="item in enabledOption" :key="item.code" :value="item.code" :label="item.name"></el-option>
			      </el-select>
			    </el-form-item>
			    <el-form-item>
			      <el-button type="primary" @click="clickQuery" icon="el-icon-search">查询</el-button>
			      <el-button type="primary" @click='clickCreate' icon="el-icon-plus">新增</el-button>
			    </el-form-item>
			  </el-form>
		    <el-table :data="tablePageData" border highlight-current-row style="width: 100%" align='center' size="small">
		      <el-table-column type="index" :index="indexMethod" label="序号" align="center" min-width="30"></el-table-column>
		      <el-table-column prop="name" label="耗材名称" align="center" min-width="60" show-overflow-tooltip></el-table-column>
		      <el-table-column prop="specification" label="规格" align="center" min-width="60" show-overflow-tooltip></el-table-column>
		      <el-table-column prop="unit" label="单位" align="center" min-width="40" show-overflow-tooltip></el-table-column>
		      <el-table-column prop="price" label="单价" align="center" min-width="40" show-overflow-tooltip></el-table-column>
		      <el-table-column prop="isenabled" label="是否启用" align="center" min-width="40" :formatter="formatterEnabled"></el-table-column>
		      <el-table-column prop="lastaccount" label="最后修改账户" align="center" min-width="60" show-overflow-tooltip></el-table-column>
		      <el-table-column prop="lasttime" label="最后修改时间" align="center" min-width="80" show-overflow-tooltip></el-table-column>
		      <el-table-column label="操作" min-width="100" align='center'>
            <template slot-scope="scope">
              <el-button class="op-mini" @click="clickUpdate(scope.row, scope.$index)" type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button class="op-mini" @click="deleteData(scope.$index)" type="danger" size="mini" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
		    </el-table>
		    <div class="pagination-container">
		      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryData.page" :page-sizes="[10, 20, 30, 50]" :page-size="queryData.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" background></el-pagination>
		    </div>
		  </div>
		  <div key="edit" class="page-show" v-else>
		  	<content-title>耗材管理详情</content-title>
		    <el-form class="line-form" label-width="30%" label-position="right" :model="formTemp" :rules="rules" ref="formEdit" size="small">
		      <el-form-item label="耗材名称" prop="name">
		        <el-input v-model="formTemp.name"></el-input>
		      </el-form-item>
		      <el-form-item label="规格" prop="specification">
		        <el-input v-model="formTemp.specification"></el-input>
		      </el-form-item>
		      <el-form-item label="单位" prop="unit">
		        <el-input v-model="formTemp.unit"></el-input>
		      </el-form-item>
		      <el-form-item label="单价" prop="price">
		        <el-input v-model="formTemp.price"></el-input>
		      </el-form-item>
		      <el-form-item label="生产厂商" prop="company">
		        <el-input v-model="formTemp.company"></el-input>
		      </el-form-item>
		      <el-form-item label="是否启用" prop="isenabled">
		        <el-switch v-model="formTemp.isenabled" active-value="1" inactive-value="2"></el-switch>
		      </el-form-item>
		      <el-form-item label="是否高值耗材" prop="ishighvalue">
		        <el-switch v-model="formTemp.ishighvalue" active-value="1" inactive-value="2"></el-switch>
		      </el-form-item>
		      <el-form-item label="备注" prop="remark">
		        <el-input type="textarea" v-model="formTemp.remark" autosize></el-input>
		      </el-form-item>
		      <el-form-item label="最后修改账户" prop="lastaccount" v-if="statusForm=='update'">
		        <span>{{formTemp.lastaccount}}</span>
		      </el-form-item>
		      <el-form-item label="最后修改时间" prop='lasttime' v-if="statusForm=='update'">
		        <span>{{formTemp.lasttime}}</span>
		      </el-form-item>
	        <div class="submit-container">
	          <el-button v-if="statusForm=='create'" type="primary" @click="createData">确定</el-button>
	          <el-button v-else type="primary" @click="updateData">确定</el-button>
	          <el-button @click="visibleList = true">返回</el-button>
	        </div>
		    </el-form>
		  </div>
		</transition>
	</div>
</template>
<script>
  import ConsumableJs from './Consumable.js'

  export default ConsumableJs
</script>
<style scoped lang="scss">
	
</style>