import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, FileText, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  // Mock data for UI demonstration
  const complianceScore = {
    fullyCompliant: 80,
    widelyAcceptable: 5,
    doubtful: 10,
    nonCompliant: 5,
  };

  const sampleContracts = [
    { id: 1, name: "حساب جاري - البنك الأهلي المصري", status: "compliant", category: "الحسابات البنكية" },
    { id: 2, name: "شهادة استثمار - بنك مصر", status: "acceptable", category: "الاستثمارات" },
    { id: 3, name: "تقسيط سيارة - مرابحة", status: "compliant", category: "التمويل" },
    { id: 4, name: "بطاقة ائتمان", status: "non-compliant", category: "البطاقات البنكية" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "acceptable": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "doubtful": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "non-compliant": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant": return <CheckCircle2 className="h-4 w-4" />;
      case "acceptable": return <HelpCircle className="h-4 w-4" />;
      case "doubtful": return <AlertCircle className="h-4 w-4" />;
      case "non-compliant": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "compliant": return "متوافق تماماً";
      case "acceptable": return "مقبول بشكل واسع";
      case "doubtful": return "به شك";
      case "non-compliant": return "غير متوافق";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">ثروة - فاحص الشريعة</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <Shield className="ml-2 h-4 w-4" />
                لوحة التحكم
              </Button>
              <Button variant="outline">
                <FileText className="ml-2 h-4 w-4" />
                تقريري
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">تحقق من التوافق الشرعي لمعاملاتك المالية</h2>
          <p className="text-xl text-muted-foreground mb-8">
            أداة مبتكرة تساعدك على فهم مدى توافق عقودك واستثماراتك مع الشريعة الإسلامية
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => navigate("/questionnaire")}>
            ابدأ الفحص الآن
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </div>

        {/* Compliance Overview - Mock Results */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              نظرة عامة على التوافق الشرعي
            </CardTitle>
            <CardDescription>تحليل شامل لعقودك المالية الحالية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compliance Breakdown */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-3xl font-bold text-green-700 dark:text-green-400">
                      {complianceScore.fullyCompliant}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">متوافق تماماً مع الشريعة</p>
                  <p className="text-xs text-muted-foreground mt-1">بإجماع كل المرجعيات</p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                      {complianceScore.widelyAcceptable}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">مقبول بشكل واسع</p>
                  <p className="text-xs text-muted-foreground mt-1">من غالب المرجعيات</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
                      {complianceScore.doubtful}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">به شك</p>
                  <p className="text-xs text-muted-foreground mt-1">خلاف فقهي قوي</p>
                </CardContent>
              </Card>

              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-3xl font-bold text-red-700 dark:text-red-400">
                      {complianceScore.nonCompliant}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">غير متوافق</p>
                  <p className="text-xs text-muted-foreground mt-1">بإجماع المرجعيات</p>
                </CardContent>
              </Card>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">مستوى التوافق الإجمالي</span>
                <span className="text-muted-foreground">85%</span>
              </div>
              <Progress value={85} className="h-3" />
              <p className="text-xs text-muted-foreground">
                معظم معاملاتك متوافقة مع الشريعة. راجع التوصيات أدناه للتحسين.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle>عقودك ومعاملاتك المالية</CardTitle>
            <CardDescription>قائمة بجميع العقود والمعاملات التي تم تحليلها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleContracts.map((contract) => (
                <Card key={contract.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{contract.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {contract.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(contract.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(contract.status)}
                            {getStatusText(contract.status)}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        التفاصيل
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6">
              إضافة عقد جديد
            </Button>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold mb-2">هل تريد تقريراً مفصلاً؟</h3>
            <p className="text-muted-foreground mb-4">
              احصل على تحليل شامل مع توصيات مخصصة وبدائل شرعية
            </p>
            <Button>
              اطلب التقرير الكامل
              <FileText className="mr-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            هذا التقرير يعتمد على البيانات المقدمة ويقدم تقييماً عاماً. لا يُعتبر فتوى شرعية ملزمة.
          </p>
          <p className="mt-2">
            يُنصح دائماً باستشارة عالم شرعي متخصص للحصول على رأي مفصل.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
