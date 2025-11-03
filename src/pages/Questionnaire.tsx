import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Shield, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  banks: z.string().min(1, "يرجى اختيار بنك واحد على الأقل"),
  accountType: z.string().min(1, "يرجى اختيار نوع الحساب"),
  bankCard: z.string().min(1, "يرجى الإجابة على هذا السؤال"),
  investmentCertificate: z.string().min(1, "يرجى الإجابة على هذا السؤال"),
  installmentPurchase: z.string().min(1, "يرجى الإجابة على هذا السؤال"),
  purchaseFormat: z.string().optional(),
  latePenalty: z.string().optional(),
  penaltyCharity: z.string().optional(),
  cashLoan: z.string().min(1, "يرجى الإجابة على هذا السؤال"),
  tawarruq: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      banks: "",
      accountType: "",
      bankCard: "",
      investmentCertificate: "",
      installmentPurchase: "",
      purchaseFormat: "",
      latePenalty: "",
      penaltyCharity: "",
      cashLoan: "",
      tawarruq: "",
    },
  });

  const installmentPurchase = form.watch("installmentPurchase");
  const latePenalty = form.watch("latePenalty");
  const cashLoan = form.watch("cashLoan");

  const egyptianBanks = [
    { value: "nbe", label: "البنك الأهلي المصري" },
    { value: "bm", label: "بنك مصر" },
    { value: "cib", label: "البنك التجاري الدولي CIB" },
    { value: "bdc", label: "بنك القاهرة" },
    { value: "boa", label: "بنك الإسكندرية" },
    { value: "qnba", label: "QNB الأهلي" },
    { value: "fib", label: "بنك فيصل الإسلامي المصري" },
    { value: "adib", label: "بنك أبو ظبي الإسلامي" },
    { value: "babe", label: "بنك البركة مصر" },
  ];

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "تم إرسال البيانات بنجاح",
      description: "جاري تحليل معاملاتك المالية...",
    });
    
    // Navigate to results page (to be created)
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["banks", "accountType", "bankCard"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["investmentCertificate", "installmentPurchase"];
      if (installmentPurchase === "yes") {
        fieldsToValidate.push("purchaseFormat", "latePenalty");
        if (latePenalty === "yes") {
          fieldsToValidate.push("penaltyCharity");
        }
      }
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">ثروة - فاحص الشريعة</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">الخطوة {currentStep} من {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>استبيان المعاملات المالية</CardTitle>
            <CardDescription>
              أجب على الأسئلة التالية لنساعدك في تقييم التوافق الشرعي لمعاملاتك المالية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Banking Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <FormField
                      control={form.control}
                      name="banks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1. ما البنوك التي تتعامل معها؟</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر البنك" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {egyptianBanks.map((bank) => (
                                <SelectItem key={bank.value} value={bank.value}>
                                  {bank.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            اختر البنك الذي تملك فيه حسابات أو تعاملات رئيسية
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2. ما نوع حسابك البنكي؟</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الحساب" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="current">حساب جاري</SelectItem>
                              <SelectItem value="investment">حساب استثمار</SelectItem>
                              <SelectItem value="both">كلاهما</SelectItem>
                              <SelectItem value="none">لا أمتلك</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            يرجى تحديد نوع الحسابات التي تمتلكها في البنوك المذكورة أعلاه
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>3. هل لديك بطاقة بنكية؟</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع البطاقة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="debit">بطاقة خصم فوري (Debit Card)</SelectItem>
                              <SelectItem value="credit">بطاقة ائتمان (Credit Card)</SelectItem>
                              <SelectItem value="both">كلاهما</SelectItem>
                              <SelectItem value="none">لا أمتلك</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Investments & Installments */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <FormField
                      control={form.control}
                      name="investmentCertificate"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>4. هل لديك أي شهادة استثمار؟</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal mr-2">نعم</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal mr-2">لا</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            مثل شهادات الإيداع البنكية أو الصكوك
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="installmentPurchase"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>5. هل اشتريت سيارة أو عقار بالتقسيط من قبل؟</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal mr-2">نعم</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal mr-2">لا</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            سواء كان ذلك من بنك، شركة تمويل، أو من فرد
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {installmentPurchase === "yes" && (
                      <>
                        <FormField
                          control={form.control}
                          name="purchaseFormat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>6. ما صيغة شراء السيارة أو الشقة؟</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر الصيغة" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="murabaha">مرابحة</SelectItem>
                                  <SelectItem value="ijara">إجارة</SelectItem>
                                  <SelectItem value="diminishing">مشاركة متناقصة</SelectItem>
                                  <SelectItem value="conventional">تمويل تقليدي</SelectItem>
                                  <SelectItem value="other">أخرى</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                يرجى تحديد الصيغة العقدية التي تم بها الشراء (عادة ما تكون مذكورة في العقد)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="latePenalty"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>7. هل هناك شرط لغرامة التأخير؟</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal mr-2">نعم</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal mr-2">لا</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="unsure" />
                                    </FormControl>
                                    <FormLabel className="font-normal mr-2">لست متأكدًا</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormDescription>
                                هل يتضمن العقد بندًا يفرض غرامة مالية في حال التأخر عن سداد الأقساط؟
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {latePenalty === "yes" && (
                          <FormField
                            control={form.control}
                            name="penaltyCharity"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>
                                  8. هل هناك تعهد من البنك بصرف غرامة التأخير كصدقة وعدم التربح منها؟
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex gap-4"
                                  >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="yes" />
                                      </FormControl>
                                      <FormLabel className="font-normal mr-2">نعم</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="no" />
                                      </FormControl>
                                      <FormLabel className="font-normal mr-2">لا</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="unsure" />
                                      </FormControl>
                                      <FormLabel className="font-normal mr-2">لست متأكدًا</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormDescription>
                                  عادةً ما تُذكر هذه الشروط في العقود المتوافقة مع الشريعة
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Loans */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <FormField
                      control={form.control}
                      name="cashLoan"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>9. هل حصلت على قرض نقدي من أي بنك من قبل؟</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal mr-2">نعم</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal mr-2">لا</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            قرض شخصي، قرض بضمان، أو غيره
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {cashLoan === "yes" && (
                      <FormField
                        control={form.control}
                        name="tawarruq"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>
                              10. إن كنت حصلت على قرض نقدي من بنك إسلامي، هل كان بصيغة التورق؟
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex gap-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <FormLabel className="font-normal mr-2">نعم</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="font-normal mr-2">لا</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="unsure" />
                                  </FormControl>
                                  <FormLabel className="font-normal mr-2">لست متأكدًا</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="na" />
                                  </FormControl>
                                  <FormLabel className="font-normal mr-2">لا ينطبق</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              التورق هو صيغة معروفة في التمويل الإسلامي للحصول على السيولة النقدية بحيث تشتري معادن دولية وتبيعها للبنك
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">جاهز لإكمال التقييم؟</p>
                          <p className="text-sm text-muted-foreground">
                            بعد الضغط على إرسال، سنقوم بتحليل معاملاتك وإظهار نتائج التوافق الشرعي
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    السابق
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={nextStep}>
                      التالي
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit">
                      إرسال التقييم
                      <CheckCircle className="mr-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Questionnaire;