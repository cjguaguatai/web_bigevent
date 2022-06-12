$(function() {
    const form = layui.form
    // 获取 表格数据
    const initArtCateList = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: (res) => {
                //id在此时请求回来
                // console.log(res);
                // 调用 template
                const htmlStr = template("tpl-table", res);
                $("tbody").empty().html(htmlStr);
            },
        });
    };

   
    let indexAdd = null
    $("#btnAddCate").click(() => {
        indexAdd=layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $('#dialog-add').html(),
        });
    });
    //添加文章分类，通过事件委托
    $('body').on('submit','#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success: function(res) {
                if(res.status !==0) return layer.msg('添加文章分类失败')
                layer.msg('添加文章分类成功')
                initArtCateList();
                layer.close(indexAdd);
                // console.log(res);
            }
        })
    })

    //通过事件委托打开编辑框
    let indexEdit = null;
    $("tbody").on("click", ".btn-edit", function () {
        // 弹出修改文章分类的弹窗
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        });
        const id=$(this).attr("data-id");
        $.ajax({
            type: "GET",
            url:'/my/article/cates/'+id,
            success: function (res) {
                // console.log(res);
                form.val("form-edit", res.data);
            },
        })
    });

    //通过事件委托，修改文件分类
    $('body').on('submit','#form-edit',function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:(res)=>{
                if(res.status !==0) return layer.msg('更改文章分类失败')
                layer.msg('更改文章分类成功')
                initArtCateList();
                layer.close(indexEdit);
                console.log(111);
            },
        })
    })
    //删除功能
    $('tbody').on('click','.btn-delete' ,function(){
        const id = $(this).attr('data-id');
        layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
            $.ajax({
                type: "get",
                url: "/my/article/deletecate/"+id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除分类失败！");
                    }
                    layer.msg("删除分类成功！");
                    layer.close(index);
                    initArtCateList();
                    console.log(res);
                },
            })
        })
    })
    initArtCateList();
})