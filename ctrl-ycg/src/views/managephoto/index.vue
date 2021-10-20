<template>
	<div>
		<Appheader></Appheader>
		<el-container>
			<Appaside asideName="managephoto" :asideIdx="['3']"></Appaside>
			<el-container>
				<el-main>
					<el-tabs type="border-card" :value="tabnum" @tab-click="handleClick">
						<!-- 相册库 -->
						<el-tab-pane name="1">
							<!-- 标签标题 -->
							<span slot="label"> 相册库 </span>
							<div class="tips">
								<p>注意：相册建立后不可以进行删除操作</p>
								<p>
									每个用户默认赠送<span class="red">5G</span
									>图片空间；图片上传成功后，图片大小立即计入总空间，不足或超出后需要到增值服务中自行购买。<a
										class="blue"
										@click="
											$tools.openUrl('https://www.yuncaigou.net/s-show-11.html')
										"
										>点击打开购买地址</a
									>
								</p>
							</div>
							<div class="progress-box">
								<h4>图片空间</h4>
								<div class="title" v-if="percent_i > 80">
									<p class="red">（您的图片空间即将不足，</p>
									<a
										class="el-button el-button--danger"
										@click="
											$tools.openUrl('https://www.yuncaigou.net/s-show-11.html')
										"
										>前往购买图片空间</a
									>
									<p class="red">）</p>
								</div>
								<el-progress
									v-if="percent_i > 0 || percent_i == 0"
									:percentage="percent_i"
									:show-text="false"
									:status="percent_i > 50 ? 'warning' : 'success'"
								></el-progress>
								<span v-if="percent_i > 0 || percent_i == 0"
									>已使用 {{ use_i }} / {{ all_i }}</span
								>
							</div>
							<div class="mt20">
								<!-- 商品操作 -->
								<div class="table-operate">
									<!-- <el-button type="primary" plain @click="deleteAlbums"
										>批量删除</el-button
									> -->
									<el-button type="primary" @click="openEditPop"
										>添加相册</el-button
									>
								</div>
								<!-- 搜索相册 -->
								<div class="table-search">
									<el-input
										placeholder="请搜索相册关键词"
										v-model="keywords"
										class="input-with-select"
									>
										<el-button
											slot="append"
											icon="el-icon-search"
											@click="searchProduct"
										></el-button>
									</el-input>
									<el-button
										class="clear-search"
										slot="append"
										@click="clearSearch"
										>清空搜索</el-button
									>
								</div>
								<el-table
									:data="tableData"
									border
									style="width: 100%"
									v-loading="loading"
									key="table"
								>
									<!-- <el-table-column
										:resizable="false"
										type="selection"
										width="50"
										align="center"
										:selectable="selectEnable"
									></el-table-column> -->
									<el-table-column
										:resizable="false"
										fixed
										label="相册名称"
										align="center"
									>
										<template slot-scope="scope">
											<a
												@click="openPhotoEdit(scope.row.title, scope.row.id)"
												>{{ scope.row.title }}</a
											>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="更新时间"
										align="center"
									>
										<template slot-scope="scope">
											<span>{{ $tools.timeToDate(scope.row.edittime) }}</span>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="操作"
										fixed="right"
										align="center"
										width="200px"
									>
										<template slot-scope="scope">
											<div>
												<el-button
													size="mini"
													type="primary"
													@click="
														openPhotoUpload(scope.row.title, scope.row.id)
													"
													>上传</el-button
												>
												<el-button
													size="mini"
													type="warning"
													@click="openEditPop(scope.row)"
													>编辑</el-button
												>
												<!-- <el-button
													@click.native.prevent="deleteRow(scope.row)"
													type="danger"
													size="mini"
													v-if="scope.row.total == 0"
												>
													删除
												</el-button> -->
											</div>
										</template>
									</el-table-column>
								</el-table>
								<el-pagination
									@current-change="handleCurrentChange"
									:current-page.sync="currentPage"
									:page-size="20"
									background
									layout="total, prev, pager, next, jumper"
									:total="total"
									:hide-on-single-page="true"
								>
								</el-pagination>
							</div>

							<!-- 上传图片 -->
							<el-drawer
								:title="`上传图片到 ${album.title}`"
								:visible.sync="uploadShow"
								size="70%"
							>
								<label class="el-form-item__label">选择图片</label>
								<Appupload
									:albumid="album.id"
									@uploadPhotos="uploadPhotos"
								></Appupload>
							</el-drawer>
							<!-- 编辑相册图片 -->
							<el-drawer
								:title="`相册-${album.title} （请拖拽图片进行权重排序；双击名称进行修改图片名，及回车键保存）`"
								:visible.sync="photoAlbumShow"
								size="80%"
								:before-close="handleClose"
							>
								<draggable
									:list="editdatas"
									:disabled="!enabled"
									class="hotedit-ul"
									id="hotedit-ul"
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
										<div class="img-box">
											<el-image
												:src="item.thumb"
												lazy
												@click="$tools.openUrl(item.thumb)"
											></el-image>
										</div>
										<el-input
											v-if="editnameshow && picnameid == item.id"
											size="mini"
											v-model="picname"
											class="pic-name"
											id="inputbox"
											v-loading="nameload"
											element-loading-spinner="el-icon-loading"
											@keyup.enter.native="$event.target.blur"
											@blur="savePicName(index)"
										></el-input>
										<span
											v-else
											@dblclick="editPicName(item.introduce, item.id)"
											>{{ item.introduce }}</span
										>
										<i
											:class="[
												'iconfont',
												'check',
												chooselist.indexOf(item.id) !== -1 ? 'on' : '',
											]"
											@click.stop="chooseImage(item)"
											>&#xe602;</i
										>
										<i
											class="iconfont up"
											@click.stop="moveToFirst(index, item)"
											>&#xe6b6;</i
										>
										<i class="iconfont" @click.stop="deletePhoto(item.id)"
											>&#xe633;</i
										>
									</div>
								</draggable>
								<div class="edit-subbtn">
									<el-button
										type="primary"
										plain
										@click="deleteSomePhoto"
										v-loading="plloading"
										element-loading-spinner="el-icon-loading"
										>批量删除</el-button
									>
									<el-button
										@click="deleteAllPhoto"
										v-loading="delloading"
										element-loading-spinner="el-icon-loading"
										>全部删除</el-button
									>
									<el-button
										type="primary"
										@click="submitPhotoEdit"
										v-loading="editload"
										element-loading-spinner="el-icon-loading"
										>保存排序</el-button
									>
								</div>
							</el-drawer>
						</el-tab-pane>
						<!-- 批量修改图片 -->
						<el-tab-pane name="2">
							<span slot="label"> 批量修改图片 </span>
							<div class="old-url">
								<div class="tips">
									<p>
										批量修改图片是将已上传到图库中并且已经使用此图片发布过产品的图片进行替换；
									</p>
									<p>
										目前图片替换仅支持产品主图替换，暂不支持产品详情图片替换；如果您的产品需要更新产品图片建议您使用此方法；
									</p>
									<p>
										<span class="red"
											>批量是不可逆的过程，请您在使用此功能前再次确认是否需要执行此操作！</span
										>
									</p>
								</div>
								<div class="table-search">
									<label class="el-form-item__label">被替换图片</label>
									<el-input
										placeholder="请输入被替换图片的完整URL地址，并检出商品"
										v-model="searchurl"
										class="input-with-select"
									>
										<el-button
											slot="append"
											icon="el-icon-search"
											@click="getChangeProData"
										></el-button>
									</el-input>
								</div>
								<div>
									<label class="el-form-item__label">选择新图片</label>
									<div
										class="el-button el-button--primary"
										@click="choosePicShow = true"
									>
										选择产品图片
									</div>
									<div class="list-group-item" v-if="proImgurl">
										<img :src="proImgurl" />
										<i class="iconfont" @click="proImgurl = ''">&#xe633;</i>
									</div>
								</div>

								<div class="table-operate" v-if="ProtableData.length">
									<el-button
										type="primary"
										plain
										@click="changePhoto"
										v-loading="changeload"
										element-loading-spinner="el-icon-loading"
										>批量替换</el-button
									>
								</div>
								<el-table
									:data="ProtableData"
									border
									style="width: 100%"
									@selection-change="handleSelectionPro"
									v-loading="changeloading"
									key="protable"
									class="mt20"
									ref="protable"
								>
									<el-table-column
										:resizable="false"
										type="selection"
										width="50"
										align="center"
									></el-table-column>
									<el-table-column
										:resizable="false"
										fixed
										label="产品ID"
										width="160"
										align="center"
									>
										<template slot-scope="scope">
											<span>{{ scope.row.id }}</span>
										</template>
									</el-table-column>
									<el-table-column :resizable="false" label="标题">
										<template slot-scope="scope">
											<a @click="$tools.openProduct(scope.row.id)">
												<span>{{ scope.row.title }}</span>
											</a>
										</template>
									</el-table-column>
									<el-table-column
										:resizable="false"
										label="状态"
										width="160"
										align="center"
									>
										<template slot-scope="scope">
											<span v-if="scope.row.status == 3" class="green"
												>正常</span
											>
											<span v-else-if="scope.row.status == 0" class="red"
												>下架</span
											>
											<span v-else-if="scope.row.status == 2" class="orange"
												>审核中</span
											>
											<span v-else-if="scope.row.status == 1">审核失败</span>
										</template>
									</el-table-column>
								</el-table>
							</div>
							<!-- 选择替换图片 -->
							<el-drawer
								title="请选择一张图片"
								:visible.sync="choosePicShow"
								size="70%"
								@close="choosePicShow = false"
							>
								<Apppicchoose
									:maxlength="1"
									@chooseSubmit="chooseSubmit"
									ref="choosepic"
								></Apppicchoose>
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
	GetPhotoList,
	UpdateAlbumName,
	AddAlbum,
	DeleteAlbum,
	GetPhotoPics,
	DeletePhotos,
	PostPhotoOrder,
	UpdatePhotoName,
	GetImageProList,
	PostBatchimg,
} from "../../api/apis";
import draggable from "vuedraggable";
import { mapState } from "vuex";
export default {
	name: "AppManagePhoto",
	components: {
		draggable,
	},
	data() {
		return {
			loading: false, //loading
			currentPage: 1, //分页数据
			total: 0,
			tableData: [],
			tabnum: "1", //标签页
			keywords: "", //搜索相册关键词
			photoAlbumShow: false, //显示相册
			uploadShow: false, //显示上传图片
			editShow: false, //显示编辑相册
			graphinput: "", //修改相册标题
			epageload: false, //编辑相册图片loading
			hasmove: false, //是否拖拽排序
			editdatas: [], //相册下数据
			enabled: true,
			dragging: false, //拖拽
			editload: false, //保存相册排序loading
			album: {}, //查看的相册
			multipleSelection: [], //选中项
			editnameshow: false, //修改名称input显示
			picname: "", //当前修改图片名称
			picname_copy: "", //当前修改图片名称copy
			picnameid: 0, //当前修改图片id
			nameload: false, //修改名称loading
			changeload: false, //批量替换loading
			changeloading: false, //批量替换表格loading
			changeSelection: [], //批量替换选中项
			searchurl: "", //原图片URL
			ProtableData: [], //检查商品列表
			choosePicShow: false, //选择替换图片
			proImgurl: "", //选择后的图片url
			_copy: [], //编辑相册列表copy
			delloading: false, //清空loading
			plloading: false, //批量loading
			chooselist: [], //批量选择图片id
			percent_i: 0, //图片空间进度
			use_i: "",
			all_i: "",
		};
	},
	created() {},
	computed: {
		...mapState(["userData"]),
	},
	watch: {
		userData: {
			handler(val, oldval) {
				this.getSize();
			},
			deep: true,
			immediate: true,
		},
	},
	destroyed() {
		this.tableData = [];
		this.editdatas = [];
		this.multipleSelection = [];
		this.ProtableData = [];
		this._copy = [];
	},
	mounted() {
		this.getPhotoList();
	},

	methods: {
		// 获取空间大小
		getSize() {
			let i_s = this.$state.userData.image_size,
				i_fs = this.$state.userData.image_full_size;
			this.use_i = this.$tools.bytesToSize(i_s).sizes;
			this.all_i = this.$tools.bytesToSize(i_fs).sizes;
			this.percent_i = (i_s / i_fs) * 100;
		},
		// 获取列表
		getPhotoList(page) {
			this.loading = true;
			let _page = page ? page : 1;
			GetPhotoList(_page, this.keywords).then((res) => {
				if (res.code == 0) {
					this.loading = false;
					if (res.body) {
						this.tableData = res.body.list;
						this.total = res.body.page ? res.body.page.count : 0;
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.loading = false;
					this.$message.error(res.msg);
				}
			});
		},
		// 获取相册下图片
		getPhotos(scroll) {
			this.epageload = true;
			GetPhotoPics(this.album.id).then((res) => {
				if (res.code == 0) {
					this.epageload = false;
					if (scroll) {
						document.getElementById("hotedit-ul").scrollLeft = 0;
					}
					if (res.body) {
						this.editdatas = res.body;
						this._copy = JSON.parse(JSON.stringify(res.body));
					} else {
						this.$message.error("暂无数据");
					}
				} else {
					this.epageload = false;
					this.$message.error(res.msg);
				}
			});
		},
		searchProduct() {
			this.getPhotoList(1, this.keywords);
		},
		// 清空搜索
		clearSearch() {
			this.keywords = "";
			this.currentPage = 1;
			this.getPhotoList(1);
		},
		// 多选控制
		// selectEnable(row) {
		// 	if (row.total > 0) {
		// 		return false;
		// 	} else {
		// 		return true; // 不禁用
		// 	}
		// },
		// 编辑/添加相册
		openEditPop(row) {
			this.$prompt("相册标题", row ? "编辑" : "创建", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				inputValue: row ? row.title : "",
				beforeClose: (action, instance, done) => {
					if (action === "confirm") {
						if (instance.inputValue == "") {
							this.$message.error("请输入相册名");
						} else {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = "";
							if (row.id) {
								UpdateAlbumName(row.id, instance.inputValue)
									.then((res) => {
										instance.confirmButtonLoading = false;
										instance.confirmButtonText = "确定";
										if (res.code == 0) {
											this.$message.success("保存成功");
											done();
										} else {
											this.$message.error(res.msg);
										}
									})
									.catch((err) => {
										instance.confirmButtonLoading = false;
										instance.confirmButtonText = "确定";
									});
							} else {
								AddAlbum(instance.inputValue)
									.then((res) => {
										instance.confirmButtonLoading = false;
										instance.confirmButtonText = "确定";
										if (res.code == 0) {
											this.$message.success("保存成功");
											done();
										} else {
											this.$message.error(res.msg);
										}
									})
									.catch((err) => {
										instance.confirmButtonLoading = false;
										instance.confirmButtonText = "确定";
									});
							}
						}
					} else {
						instance.confirmButtonLoading = false;
						instance.confirmButtonText = "确定";
						done();
					}
				},
			})
				.then(({ value }) => {
					this.getPhotoList(this.currentPage);
				})
				.catch(() => {});
		},
		handleCurrentChange(val) {
			this.getPhotoList(val);
		},
		handleClick(tab) {
			this.tabnum = tab.name;
		},
		// 多选
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 删除单个相册
		deleteRow(row) {
			this.$confirm("确定删除该相册？")
				.then(() => {
					let _data = [];
					_data.push(row.id);
					DeleteAlbum(_data).then((res) => {
						if (res.code == 0) {
							this.$message.success("删除成功");
							this.getPhotoList(this.currentPage);
							setTimeout(() => {
								done();
							}, 400);
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {});
		},
		// 批量删除
		deleteAlbums() {
			this.$confirm("确定删除全部选中相册？")
				.then(() => {
					let _data = [];
					this.multipleSelection.map((item) => {
						_data.push(item.id);
					});
					DeleteAlbum(_data).then((res) => {
						if (res.code == 0) {
							this.$message.success("删除成功");
							this.getPhotoList(this.currentPage);
							setTimeout(() => {
								done();
							}, 400);
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {});
		},
		// 删除单个图片
		deletePhoto(id) {
			this.$confirm("确定删除这张图片吗？")
				.then(() => {
					this.epageload = true;
					this.delPhotoApi([id]);
				})
				.catch(() => {});
		},
		// 删除全部图片
		deleteAllPhoto() {
			let ids = [];
			this.editdatas.map((item) => {
				ids.push(item.id);
			});
			this.$confirm("确定清空相册吗？")
				.then(() => {
					this.delloading = true;
					this.delPhotoApi(ids);
				})
				.catch(() => {});
		},
		// 批量选择图片
		chooseImage(item) {
			let _idx = this.chooselist.indexOf(item.id);
			_idx == -1
				? this.chooselist.push(item.id)
				: this.chooselist.splice(_idx, 1);
		},
		// 批量删除图片
		deleteSomePhoto() {
			this.$confirm("确定删除所选图片吗？")
				.then(() => {
					this.plloading = true;
					this.delPhotoApi(this.chooselist);
				})
				.catch(() => {});
		},
		delPhotoApi(ids) {
			let isall = this.delloading ? true : false;
			DeletePhotos(ids).then((res) => {
				this.epageload = false;
				this.delloading = false;
				this.plloading = false;
				if (res.code == 0) {
					this.$message.success("操作成功");
					this.getPhotos();
					if (isall) {
						this.photoAlbumShow = false;
						this.getPhotoList(this.currentPage);
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 图片移至最前
		moveToFirst(idx, item) {
			this.hasmove = true;
			this.editdatas.splice(idx, 1);
			this.editdatas.unshift(item);
		},
		// 修改图片名称
		editPicName(name, id) {
			this.picname = name;
			this.picname_copy = JSON.parse(JSON.stringify(name));
			this.picnameid = id;
			this.editnameshow = true;
			this.$nextTick(() => {
				document.getElementById("inputbox").focus();
			});
		},
		// 保存名称修改
		savePicName(idx) {
			this.nameload = true;
			if (this.picname == this.picname_copy) {
				this.nameload = false;
				this.editnameshow = false;
				this.picnameid = 0;
			} else {
				UpdatePhotoName(this.picnameid, this.picname)
					.then((res) => {
						this.nameload = false;
						this.editdatas[idx].introduce = this.picname;
						if (res.code == 0) {
							this.$message.success("修改成功");
							this.editnameshow = false;
							this.picnameid = 0;
						} else {
							this.$message.error(res.msg);
							this.$nextTick(() => {
								document.getElementById("inputbox").focus();
							});
						}
					})
					.catch((err) => {
						this.nameload = false;
						this.$message.error(err);
						this.$nextTick(() => {
							document.getElementById("inputbox").focus();
						});
					});
			}
		},
		// 上传图片弹窗
		openPhotoUpload(title, id) {
			this.uploadShow = true;
			this.album.title = title;
			this.album.id = id;
		},
		// 上传完成
		uploadPhotos() {
			this.uploadShow = false;
			this.getPhotoList(this.currentPage);
		},
		// 查看相册
		openPhotoEdit(val, id) {
			this.photoAlbumShow = true;
			this.epageload = true;
			this.album.title = val;
			this.album.id = id;
			this.getPhotos(1);
		},
		// 拖拽排序
		checkMove(e) {
			// window.console.log("index: " + e.draggedContext.futureIndex);
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
						PostPhotoOrder(this.album.id, _data).then((res) => {
							this.epageload = false;
							if (res.code == 0) {
								this.$message.success("设置成功");
								this.hasmove = false;
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
		// 保存图片排序设置
		submitPhotoEdit() {
			if (this.hasmove) {
				let _data = [];
				this.editload = true;
				this.editdatas.map((item) => {
					_data.push(item.id);
				});
				PostPhotoOrder(this.album.id, _data)
					.then((res) => {
						this.editload = false;
						if (res.code == 0) {
							this.$message.success("设置成功");
							this.hasmove = false;
							setTimeout(() => {
								this.photoAlbumShow = false;
							}, 400);
						} else {
							this.$message.error(res.msg);
						}
					})
					.catch((err) => {
						this.editload = false;
						this.$message.error(err);
					});
			} else {
				this.$message.warning("没有权重相关改动哦~");
				this.photoAlbumShow = false;
			}
		},
		// 批量替换图片
		changePhoto() {
			if (this.proImgurl == "") {
				this.$message.error("请先选择一张替换图片");
			} else {
				this.$confirm("确定批量替换选中商品中的原图片？(此操作不可逆)")
					.then(() => {
						this.changeload = true;
						let _data = [];
						this.changeSelection.map((item) => {
							_data.push(item.id);
						});
						PostBatchimg(this.searchurl, this.proImgurl, _data)
							.then((res) => {
								this.changeload = false;
								if (res.code == 0) {
									this.$message.success("操作成功！");
									this.proImgurl = "";
									this.searchurl = "";
									this.ProtableData = [];
									this.$refs.protable.clearSelection();
								} else {
									this.$message.error(res.msg);
								}
							})
							.catch((err) => {
								this.changeload = false;
								this.$message.error(err);
							});
					})
					.catch(() => {});
			}
		},
		// 批量替换多选
		handleSelectionPro(val) {
			this.changeSelection = val;
		},
		// 检查商品
		getChangeProData() {
			let _str = "image.yuncaigou.net",
				_str2 = "caigou.ctrl.com.cn";
			if (
				this.searchurl.indexOf(_str) > 0 ||
				this.searchurl.indexOf(_str2) > 0
			) {
				this.changeloading = true;
				GetImageProList(this.searchurl)
					.then((res) => {
						this.changeloading = false;
						if (res.code == 0) {
							this.ProtableData = res.body;
						} else {
							this.$message.error(res.msg);
						}
					})
					.catch((err) => {
						this.changeloading = false;
						this.$message.error(err);
					});
			} else {
				this.$message.error("URL地址无效，请重新输入");
			}
		},
		// 选择替换商品
		chooseSubmit(data) {
			this.proImgurl = data[0];
			this.choosePicShow = false;
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .el-button--mini,
.el-button--mini.is-round {
	padding: 6px;
}
.el-input-group {
	max-width: 300px !important;
}
.sub-btn {
	margin-top: 40px;
}
.edit-subbtn {
	padding: 20px 0;
    width: 100%;
    position: fixed;
    bottom: 20px;
    background: #ffffff;
}
.hotedit-ul {
	height: auto;
	overflow-x: auto;
	white-space: inherit;
	padding-right: 0;
	.hotedit-li {
		width: 100px;
		margin-right: 6px;
		margin-bottom: 10px;
		box-sizing: content-box;
		position: relative;
	}
	.hotedit-li+.hotedit-li {
		margin-left: 0;
	}
	.img-box {
		cursor: pointer;
		height: 100px;
		z-index: 99;
	}
	.check {
		right: 0;
		top: auto;
		bottom: 26px;
	}
	.up {
		right: 24px;
		background: #d4d3d3;
		color: #fff;
		font-size: 14px;
		line-height: 20px;
		text-align: center;
	}
	span {
		text-align: center;
	}
	.on {
		color: #1a8cff !important;
	}
}
.pic-name {
	margin-top: 6px;
	/deep/ .el-input__inner {
		border: none;
		padding: 0px;
		text-align: center;
		max-width: 100%;
		font-size: 14px;
		color: #222222;
		line-height: 16px;
		height: 16px;
	}
}
.old-url {
	.table-search {
		width: 100%;
		text-align: left;
		.el-input-group {
			max-width: 560px !important;
		}
	}
	.list-group-item {
		display: block;
		padding-left: 80px;
		margin-top: 10px;
	}
	.table-operate {
		margin: 40px 0 10px;
	}
}
</style>
