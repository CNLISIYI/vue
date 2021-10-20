<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="productmanage" :asideIdx="['1']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs
						type="border-card"
						:value="tabnum"
						@tab-click="handleClick"
						id="el-main"
					>
						<!-- 上架商品 -->
						<el-tab-pane name="1">
							<!-- 标签标题 -->
							<span slot="label"> 上架商品 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>
									若您的商品属于
									<span class="red"
										>医疗器械、兽药、危险化学品、农药、保健品</span
									>
									这五大类需要进行行业资质备案，否则商品不予展现，详情点击
									<a
										@click="
											$tools.openUrl('http://yuncaigou.net/help.html?id=5')
										"
										>《特殊行业资质备案规范》</a
									>
								</p>
								<p>
									标题为<span class="orange">黄色</span
									>的商品为会员已设置的爆款商品
								</p>
								<ul>
									<li>
										<a>{{ sellnums }}条</a>
										<p>剩余发布商品数量</p>
									</li>
									<li v-loading="numloadu">
										<a>{{ totalu }}条</a>
										<p>上架商品数</p>
									</li>
									<li v-loading="numloadh">
										<a>{{ totalh }}条</a>
										<p>爆款商品数</p>
									</li>
								</ul>
							</div>
							<Appprotable
								pagename="puton"
								:tableData="tableDatau"
								:total="totalu"
								@searchProduct="searchProduct"
								@handleChange="handleChange"
								@handleSizeChange="handleSizeChange"
								@clearSearch="clearSearch"
								:currentPage="currentPage"
								:loading="loading"
								@managePro="
									getAllProduct(1, 3, currentPage);
									getProNums();
								"
								@sethotPro="sethotPro"
								ref="protable"
							></Appprotable>
						</el-tab-pane>
						<!-- 下架商品 -->
						<el-tab-pane name="2">
							<!-- 标签标题 -->
							<span slot="label"> 下架商品 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>
									若您的商品属于
									<span class="red"
										>医疗器械、兽药、危险化学品、农药、保健品</span
									>
									这五大类需要进行行业资质备案，否则商品不予展现，详情点击
									<a
										@click="
											$tools.openUrl('http://yuncaigou.net/help.html?id=5')
										"
										>《特殊行业资质备案规范》</a
									>
								</p>
								<p>
									标题为<span class="orange">黄色</span
									>的商品为会员已设置的爆款商品
								</p>
								<ul>
									<li>
										<a>{{ sellnums }}条</a>
										<p>剩余发布商品数量</p>
									</li>
									<li v-loading="numloadd">
										<a>{{ totald }}条</a>
										<p>下架商品数</p>
									</li>
									<li v-loading="numloadh">
										<a>{{ totalh }}条</a>
										<p>爆款商品数</p>
									</li>
								</ul>
							</div>
							<Appprotable
								pagename="putdown"
								:tableData="tableDatad"
								:total="totald"
								@searchProduct="searchProduct"
								@handleChange="handleChange"
								@handleSizeChange="handleSizeChange"
								@clearSearch="clearSearch"
								:currentPage="currentPage"
								:loading="loading"
								@managePro="
									getAllProduct(2, 0, currentPage);
									getProNums();
								"
								ref="protable"
							></Appprotable>
						</el-tab-pane>
						<!-- 爆款商品 -->
						<el-tab-pane name="3">
							<!-- 标签标题 -->
							<span slot="label"> 爆款商品 </span>
							<!-- 说明栏 -->
							<div class="tips">
								<p>
									爆款商品又称推荐商品；普通爱采购用户可设置10条爆款商品；实地商家用户可设置30条爆款商品。
								</p>
								<p>爆款商品的权重从数字1开始递增；数字越小权重越高；</p>
								<p>设置爆款商品前请确认您的产品质量分、展示状态为最佳。</p>
							</div>
							<Appprotable
								pagename="hotpro"
								:tableData="tableDatah"
								@searchProduct="searchProduct"
								:total="totalh"
								@handleChange="handleChange"
								@handleSizeChange="handleSizeChange"
								@clearSearch="clearSearch"
								:currentPage="currentPage"
								:loading="loading"
								@openEditpop="openEditpop"
							></Appprotable>
							<el-drawer
								title="编辑爆款商品（请拖拽商品进行权重排序）"
								:visible.sync="editpopshow"
								direction="btt"
								size="40%"
								:before-close="handleClose"
							>
								<draggable
									:list="editdatas"
									:disabled="!enabled"
									class="hotedit-ul"
									ghost-class="ghost"
									:move="checkMove"
									@start="dragging = true"
									@end="dragging = false"
									v-loading="epageload"
								>
									<div
										class="hotedit-li"
										v-for="(item, index) in editdatas"
										:key="index"
									>
										<div class="img-box"><img :src="item.picture" /></div>
										<a @click="$tools.openProduct(item.id)">{{ item.title }}</a>
										<i class="iconfont nums">{{ index + 1 }}</i>
										<i
											class="iconfont up"
											@click.stop="moveToFirst(index, item)"
											>&#xe6b6;</i
										>
										<i class="iconfont" @click="unsethotPro(item.id)"
											>&#xe633;</i
										>
									</div>
								</draggable>
								<div class="edit-subbtn">
									<el-button
										@click="deleteHotPro"
										v-loading="delload"
										element-loading-spinner="el-icon-loading"
										>清空爆款</el-button
									>
									<el-button
										type="primary"
										@click="submitHotEdit"
										v-loading="editload"
										element-loading-spinner="el-icon-loading"
										>保存排序</el-button
									>
								</div>
							</el-drawer>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<Appfooter></Appfooter>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	GetSellTotal,
	GetAllProduct,
	GetHotProduct,
	DelAllHots,
	PostHotPro,
	DelHotProduct,
} from "../../api/apis";
import draggable from "vuedraggable";
export default {
	name: "AppProductManage",
	components: {
		draggable,
	},
	data() {
		return {
			tableDatau: [], //上架
			tableDatad: [], //下架
			tableDatah: [], //爆款
			tabnum: "1",
			totalu: 0,
			totald: 0,
			totalh: 0,
			keyword: "", //搜索词
			currentPage: 1, //页码
			loading: false, //表格加载
			editpopshow: false, //编辑爆款弹窗
			delload: false, //取消全部爆款loading
			editload: false, //编辑爆款loading
			editdatas: [], //编辑爆款列表
			unsetList: [], //取消爆款列表
			epageload: false, //爆款列表loading
			enabled: true,
			dragging: false, //拖拽
			hasmove: false, //是否发生拖拽
			setpopshow: false, //设置爆款弹窗
			sellnums: 0, // 剩余发布数量
			_copy: [], //编辑爆款列表copy
			numloadh: false, //爆款数据loading
			numloadu: false, //上架数据loading
			numloadd: false, //下架数据loading
			pagesize: 20, //每页条数
		};
	},
	created() {
		this.currentPage = this.$route.params.pagenum
			? this.$route.params.pagenum
			: 1;
		this.tabnum =
			!this.$route.params.page || this.$route.params.page == "puton"
				? "1"
				: "2";
	},
	computed: {},
	destroyed() {
		this.tableDatau = [];
		this.tableDatad = [];
		this.tableDatah = [];
		this._copy = [];
		this.editdatas = [];
	},
	mounted() {
		this.getProNums();
		if (this.$route.params.pagenum) {
			if (this.tabnum == "1") {
				this.getAllProduct(1, 3, this.$route.params.pagenum);
				this.getHotPro(this.$route.params.pagenum, this.pagesize);
			}
			if (this.tabnum == "2") {
				this.getAllProduct(2, 0, this.$route.params.pagenum);
			}
			if (this.tabnum == "3") {
				this.getHotPro(this.$route.params.pagenum, this.pagesize);
			}
		} else {
			if (this.tabnum == "1") {
				this.getAllProduct(1, 3);
				this.getHotPro(1, this.pagesize);
			}
			if (this.tabnum == "2") {
				this.getAllProduct(2, 0);
			}
			if (this.tabnum == "3") {
				this.getHotPro(1, this.pagesize);
			}
		}
	},

	methods: {
		// 获取上架/下架/爆款商品数
		getProNums() {
			this.numloadh = true;
			this.numloadu = true;
			this.numloadd = true;
			// 爆款数
			GetHotProduct(1, this.keyword, 20).then((res) => {
				if (res.code == 0) {
					this.totalh = res.body.page.count;
					this.numloadh = false;
				} else {
					this.$message.error(res.msg);
				}
			});
			// 上架数
			GetAllProduct(3, 1).then((res) => {
				if (res.code == 0) {
					this.totalu = res.body.page.count;
					this.numloadu = false;
				} else {
					this.$message.error(res.msg);
				}
			});
			// 下架数
			GetAllProduct(0, 1).then((res) => {
				if (res.code == 0) {
					this.totald = res.body.page.count;
					this.numloadd = false;
				} else {
					this.$message.error(res.msg);
				}
			});
			// 获取剩余发布数量
			GetSellTotal().then((res) => {
				if (res.code == 0) {
					let _num =
						res.body.bd_total -
						res.body.status_total_2 -
						res.body.status_total_3;
					this.sellnums = parseInt(_num) < 0 ? 0 : _num;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 获取爆款
		getHotPro(page, perpage) {
			let _keyword = this.keyword,
				_page = page ? page : 1,
				_perpage = perpage ? perpage : 20;
			if (_perpage > 20) {
				this.epageload = true;
			}
			GetHotProduct(_page, _keyword, _perpage).then((res) => {
				this.epageload = false;
				if (res.code == 0) {
					if (_perpage > 60) {
						this.editdatas = res.body.list;
						this._copy = JSON.parse(JSON.stringify(res.body.list));
					} else {
						this.tableDatah = [];
						res.body.list.map((item) => {
							this.tableDatah.push(item);
						});
					}
					if (_keyword) {
						this.totalh = res.body.page.count;
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 获取全部商品
		getAllProduct(tab, status, page) {
			let _keyword = this.keyword,
				_page = page ? page : 1,
				_perpage = this.pagesize ? this.pagesize : 20;
			this.loading = true;
			document.getElementById("el-main").scrollTop = 0;
			if (tab == "1") {
				this.tableDatau = [];
			} else {
				this.tableDatad = [];
			}
			GetAllProduct(status, _page, _keyword, _perpage).then((res) => {
				this.loading = false;
				if (res.code == 0) {
					if (tab == "1") {
						res.body.list.map((item) => {
							this.tableDatau.push(item);
						});
						if (this.keyword) {
							this.totalu = res.body.page.count;
						}
					} else {
						res.body.list.map((item) => {
							this.tableDatad.push(item);
						});
						if (this.keyword) {
							this.totald = res.body.page.count;
						}
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 爆款移至最前
		moveToFirst(idx, item) {
			this.hasmove = true;
			this.editdatas.splice(idx, 1);
			this.editdatas.unshift(item);
		},
		// 取消单个爆款
		unsethotPro(id) {
			this.$confirm("确定取消此爆款商品吗？")
				.then(() => {
					this.epageload = true;
					DelHotProduct(id).then((res) => {
						this.epageload = false;
						if (res.code == 0) {
							this.$message.success("操作成功");
							setTimeout(() => {
								this.getHotPro(1, 99999);
							}, 1000);
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {
					done();
				});
		},
		// 取消全部爆款
		deleteHotPro() {
			this.$confirm("确定清空全部爆款设置吗？")
				.then(() => {
					this.delload = true;
					DelAllHots().then((res) => {
						this.delload = false;
						if (res.code == 0) {
							this.$message.success("操作成功");
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {});
		},
		// 追加设置爆款
		sethotPro() {
			this.getHotPro(this.currentPage, this.pagesize);
			this.getProNums();
			this.getAllProduct(1, 3, this.currentPage);
		},
		// 拖拽排序
		checkMove(e) {
			window.console.log("index: " + e.draggedContext.futureIndex);
			this.hasmove = true;
		},
		// 关闭编辑弹窗
		handleClose(done) {
			if (this.hasmove) {
				this.$confirm("尚未保存权重排序，是否保存？")
					.then(() => {
						let _data = [];
						this.editdatas.map((item) => {
							_data.push(item.id);
						});
						this.epageload = true;
						PostHotPro(_data).then((res) => {
							this.epageload = false;
							if (res.code == 0) {
								this.$message.success("设置成功");
								this.hasmove = false;
								this.getHotPro(this.currentPage, this.pagesize);
								setTimeout(() => {
									done();
								}, 400);
							} else {
								this.$message.error(res.msg);
							}
						});
					})
					.catch(() => {
						this.editdatas = this._copy;
						this.hasmove = false;
						done();
					});
			} else {
				done();
			}
		},
		// 保存爆款设置
		submitHotEdit() {
			if (this.hasmove) {
				let _data = [];
				this.editload = true;
				this.editdatas.map((item) => {
					_data.push(item.id);
				});
				PostHotPro(_data).then((res) => {
					this.editload = false;
					if (res.code == 0) {
						this.$message.success("设置成功");
						this.hasmove = false;
						this.getHotPro(this.currentPage, this.pagesize);
						setTimeout(() => {
							this.editpopshow = false;
						}, 400);
					} else {
						this.$message.error(res.msg);
					}
				});
			} else {
				this.$message.warning("没有权重相关改动哦~");
				this.editpopshow = false;
			}
		},
		// 打开权重弹窗
		openEditpop() {
			this.editpopshow = true;
			if (this.editdatas.length == 0) {
				this.getHotPro(1, 99999);
			}
		},
		// 选择页码
		handleChange(val) {
			this.currentPage = val;
			if (this.tabnum == "1") {
				this.getAllProduct(1, 3, val);
			}
			if (this.tabnum == "2") {
				this.getAllProduct(2, 0, val);
			}
			if (this.tabnum == "3") {
				this.getHotPro(val, this.pagesize);
			}
		},
		// 选择页条数
		handleSizeChange(val) {
			this.currentPage = 1;
			this.pagesize = val;
			if (this.tabnum == "1") {
				this.getAllProduct(1, 3, 1);
			}
			if (this.tabnum == "2") {
				this.getAllProduct(2, 0, 1);
			}
			if (this.tabnum == "3") {
				this.getHotPro(1, val);
			}
		},
		// 切换标签
		handleClick(tab) {
			this.tabnum = tab.name;
			this.keyword = "";
			this.currentPage = 1;
			if (tab.name == "1" && this.tableDatau.length < 1) {
				this.getAllProduct(1, 3);
			}
			if (tab.name == "2" && this.tableDatad.length < 1) {
				this.getAllProduct(2, 0);
			}
			if (tab.name == "3" && this.tableDatah.length < 1) {
				this.getHotPro(1, this.pagesize);
			}
		},
		// 清空搜索
		clearSearch() {
			this.currentPage = 1;
			this.keyword = "";
			if (this.tabnum == "1") {
				this.getAllProduct(1, 3);
			}
			if (this.tabnum == "2") {
				this.getAllProduct(2, 0);
			}
			if (this.tabnum == "3") {
				this.getHotPro(1, this.pagesize);
			}
		},
		// 搜索产品
		searchProduct(val) {
			this.keyword = val;
			if (this.tabnum == "1") {
				this.getAllProduct(1, 3);
			}
			if (this.tabnum == "2") {
				this.getAllProduct(2, 0);
			}
			if (this.tabnum == "3") {
				this.getHotPro(1, this.pagesize);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-drawer__body {
	padding-top: 40px;
}
/deep/ .el-drawer__header {
	margin-bottom: 0;
	padding-bottom: 0px;
}
.hotedit-li {
	.nums {
		left: 0;
		line-height: 20px;
		text-align: center;
		font-size: 14px;
		border-radius: 6px;
		overflow: hidden;
		color: #ffffff;
		background: rgba($color: #000, $alpha: 0.5);
	}
}
</style>
