import type { FC } from "react"
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"

const HomePage: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("home.welcome.title")}</CardTitle>
            <CardDescription>{t("home.welcome.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("home.welcome.content")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("home.features.title")}</CardTitle>
            <CardDescription>{t("home.features.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>{t("home.features.list.typescript")}</li>
              <li>{t("home.features.list.tailwind")}</li>
              <li>{t("home.features.list.components")}</li>
              <li>{t("home.features.list.i18n")}</li>
              <li>{t("home.features.list.router")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("home.documentation.title")}</CardTitle>
            <CardDescription>{t("home.documentation.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("home.documentation.content")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
