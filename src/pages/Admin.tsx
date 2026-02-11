import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Search, Filter, ChevronDown, ChevronUp, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FinancialService {
  id: string;
  name: string;
  category: string;
  bank: string;
  aaoifiStandards: { number: string; title: string }[];
  status: "compliant" | "non-compliant";
  summary: string;
}

const mockServices: FinancialService[] = [
  {
    id: "1",
    name: "حساب توفير بعائد",
    category: "حسابات بنكية",
    bank: "البنك الأهلي المصري",
    aaoifiStandards: [
      { number: "5", title: "الضمانات" },
      { number: "21", title: "الأوراق المالية" },
    ],
    status: "non-compliant",
    summary: "العائد الثابت المضمون على حساب التوفير يُعد من قبيل الربا المحرم شرعاً، حيث أن البنك يضمن نسبة عائد ثابتة بغض النظر عن نتائج الاستثمار الفعلية، وهو ما يخالف مبدأ الغنم بالغرم.",
  },
  {
    id: "2",
    name: "مرابحة سيارات",
    category: "تمويل",
    bank: "بنك فيصل الإسلامي",
    aaoifiStandards: [
      { number: "8", title: "المرابحة" },
      { number: "2", title: "البطاقة المدنية" },
      { number: "5", title: "الضمانات" },
    ],
    status: "compliant",
    summary: "عقد المرابحة مستوفٍ لشروطه الشرعية: تملّك البنك للسيارة قبل بيعها للعميل، الإفصاح عن هامش الربح، عدم وجود غرامات تأخير ربوية، والالتزام بمعيار المرابحة للآمر بالشراء.",
  },
  {
    id: "3",
    name: "بطاقة ائتمان كلاسيك",
    category: "بطاقات",
    bank: "البنك التجاري الدولي CIB",
    aaoifiStandards: [
      { number: "2", title: "البطاقة المدنية" },
      { number: "5", title: "الضمانات" },
    ],
    status: "non-compliant",
    summary: "بطاقة الائتمان تفرض فوائد على الرصيد المتبقي غير المسدد، وهو ما يُعد ربا صريحاً. كما تتضمن رسوم سحب نقدي بنسبة مئوية من المبلغ وهو ما يدخل في باب الربا.",
  },
  {
    id: "4",
    name: "شهادات استثمار متغيرة العائد",
    category: "استثمار",
    bank: "بنك أبو ظبي الإسلامي",
    aaoifiStandards: [
      { number: "13", title: "المضاربة" },
      { number: "21", title: "الأوراق المالية" },
      { number: "40", title: "توزيع الأرباح" },
    ],
    status: "compliant",
    summary: "الشهادات قائمة على عقد المضاربة الشرعي مع توزيع أرباح فعلية بناءً على نتائج الاستثمار. نسبة توزيع الأرباح واضحة ومحددة مسبقاً، والخسارة على رب المال ما لم يثبت تعدٍ أو تقصير.",
  },
  {
    id: "5",
    name: "تمويل شخصي تورق",
    category: "تمويل",
    bank: "QNB الأهلي",
    aaoifiStandards: [
      { number: "30", title: "التورق" },
      { number: "5", title: "الضمانات" },
      { number: "8", title: "المرابحة" },
    ],
    status: "non-compliant",
    summary: "عملية التورق المنظم حيث يتم بيع وشراء السلعة صورياً دون قبض حقيقي، مع اتفاق مسبق بين الأطراف على إعادة البيع. هذا يُعتبر تورقاً منظماً محرماً بقرار مجمع الفقه الإسلامي.",
  },
  {
    id: "6",
    name: "إجارة منتهية بالتمليك",
    category: "تمويل",
    bank: "بنك البركة مصر",
    aaoifiStandards: [
      { number: "9", title: "الإجارة والإجارة المنتهية بالتمليك" },
      { number: "5", title: "الضمانات" },
    ],
    status: "compliant",
    summary: "عقد الإجارة مستوفٍ للشروط الشرعية: تحمّل المؤجر (البنك) لمسؤولية الصيانة الأساسية، فصل عقد الإجارة عن وعد التمليك، والأقساط تمثل أجرة حقيقية وليست أقساط قرض.",
  },
  {
    id: "7",
    name: "حساب جاري",
    category: "حسابات بنكية",
    bank: "بنك القاهرة",
    aaoifiStandards: [
      { number: "5", title: "الضمانات" },
    ],
    status: "compliant",
    summary: "الحساب الجاري يعمل بنظام القرض الحسن (الوديعة) حيث يضمن البنك رد المبلغ كاملاً دون زيادة أو نقصان، ولا يترتب عليه أي فوائد ربوية.",
  },
  {
    id: "8",
    name: "قرض شخصي بفائدة",
    category: "تمويل",
    bank: "بنك الإسكندرية",
    aaoifiStandards: [
      { number: "5", title: "الضمانات" },
    ],
    status: "non-compliant",
    summary: "القرض بفائدة ثابتة أو متغيرة هو ربا صريح محرم بالنص القرآني والسنة النبوية وإجماع العلماء. أي زيادة مشروطة على القرض تُعد ربا بصرف النظر عن تسميتها.",
  },
];

const Admin = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const categories = [...new Set(mockServices.map((s) => s.category))];

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.name.includes(searchQuery) ||
      service.bank.includes(searchQuery) ||
      service.aaoifiStandards.some((s) => s.number.includes(searchQuery) || s.title.includes(searchQuery));
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const compliantCount = mockServices.filter((s) => s.status === "compliant").length;
  const nonCompliantCount = mockServices.filter((s) => s.status === "non-compliant").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">لوحة المستشار الشرعي</h1>
                <p className="text-sm text-muted-foreground">إدارة وتقييم الخدمات المالية</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowRight className="h-4 w-4 ml-1" />
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الخدمات</p>
                  <p className="text-3xl font-bold">{mockServices.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوافقة شرعياً</p>
                  <p className="text-3xl font-bold text-emerald-600">{compliantCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">غير متوافقة</p>
                  <p className="text-3xl font-bold text-destructive">{nonCompliantCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم، البنك، أو رقم المعيار..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="compliant">متوافقة</SelectItem>
                  <SelectItem value="non-compliant">غير متوافقة</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الخدمات المالية ({filteredServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الخدمة المالية</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">البنك</TableHead>
                  <TableHead className="text-right">معايير AAOIFI</TableHead>
                  <TableHead className="text-right">التقييم</TableHead>
                  <TableHead className="text-right w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <Collapsible key={service.id} open={expandedRow === service.id} onOpenChange={(open) => setExpandedRow(open ? service.id : null)} asChild>
                    <>
                      <CollapsibleTrigger asChild>
                        <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{service.category}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{service.bank}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {service.aaoifiStandards.map((std) => (
                                <Badge key={std.number} variant="outline" className="text-xs">
                                  معيار {std.number}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {service.status === "compliant" ? (
                              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20">
                                <CheckCircle className="h-3 w-3 ml-1" />
                                متوافقة
                              </Badge>
                            ) : (
                              <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
                                <XCircle className="h-3 w-3 ml-1" />
                                غير متوافقة
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {expandedRow === service.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={6} className="py-4">
                            <div className="space-y-3 px-2">
                              <div>
                                <h4 className="font-semibold text-sm mb-1">المعايير الشرعية المرتبطة (AAOIFI):</h4>
                                <div className="flex flex-wrap gap-2">
                                  {service.aaoifiStandards.map((std) => (
                                    <span key={std.number} className="inline-flex items-center gap-1 rounded-md bg-primary/5 px-3 py-1 text-sm border border-primary/10">
                                      <span className="font-bold">#{std.number}</span>
                                      <span className="text-muted-foreground">- {std.title}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm mb-1">ملخص التقييم الشرعي:</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed bg-background rounded-md p-3 border">
                                  {service.summary}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
