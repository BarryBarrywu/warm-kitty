import SwiftUI

struct FirstRunView: View {
    let code: String
    let accent: Color
    var onClose: () -> Void

    var body: some View {
        ZStack {
            Color(hex: "462E16", alpha: 0.28).ignoresSafeArea().onTapGesture(perform: onClose)
            VStack(spacing: 0) {
                Image("idle").resizable().scaledToFit().frame(width: 96, height: 96)
                    .shadow(color: Color(hex: "784E28", alpha: 0.2), radius: 6, y: 6).padding(.bottom, 8)
                Text(L("firstTitle", code)).font(.custom("ZCOOL KuaiLe", size: 21))
                    .foregroundColor(Color(hex: "5E4630")).padding(.bottom, 8)
                Text(L("firstBody", code)).font(.custom("PingFang SC", size: 13.5))
                    .foregroundColor(Color(hex: "8A6446")).multilineTextAlignment(.center)
                    .lineSpacing(4).padding(.bottom, 18)
                Button(action: onClose) {
                    Text(L("firstBtn", code)).font(.custom("ZCOOL KuaiLe", size: 18))
                        .frame(maxWidth: .infinity).frame(height: 48)
                        .background(accent).foregroundColor(.white).cornerRadius(20)
                }.buttonStyle(.plain)
            }
            .padding(EdgeInsets(top: 26, leading: 24, bottom: 22, trailing: 24))
            .frame(width: 296)
            .background(LinearGradient(colors: [Color(hex: "FFFBF4"), Color(hex: "FDF0DD")], startPoint: .top, endPoint: .bottom))
            .cornerRadius(22)
            .shadow(color: Color(hex: "462E16", alpha: 0.45), radius: 25, y: 18)
        }
    }
}
